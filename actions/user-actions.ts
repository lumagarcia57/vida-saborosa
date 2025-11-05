"use server"

import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

type UserData = {
  email: string
  fullName: string
  username: string
  password: string
  [key: string]: any
}

type CreateUserResult = {
  success: boolean
  error?: string
}

// Function to check if a user already exists
async function checkUserExists(email: string): Promise<boolean> {
  try {
    const token = process.env.GITHUB_TOKEN

    if (!token) {
      throw new Error("GitHub token not found")
    }

    // Get all issues from the repository
    const response = await fetch("https://api.github.com/repos/lumagarcia57/vida-saborosa/issues", {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch issues")
    }

    const issues = await response.json()

    // Find issue with title "Usuários"
    const usersIssue = issues.find((issue: any) => issue.title === "Usuários")

    if (!usersIssue) {
      // No users issue found, so no users exist yet
      return false
    }

    // Get the issue body
    const issueResponse = await fetch(
      `https://api.github.com/repos/lumagarcia57/vida-saborosa/issues/${usersIssue.number}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    )

    if (!issueResponse.ok) {
      throw new Error("Failed to fetch issue details")
    }

    const issueDetails = await issueResponse.json()

    // Parse the issue body as JSON
    try {
      const users = JSON.parse(issueDetails.body || "[]")
      // Check if a user with the given email exists
      return users.some((user: any) => user.email === email)
    } catch (error) {
      // If the body is not valid JSON, assume no users
      return false
    }
  } catch (error) {
    console.error("Error checking if user exists:", error)
    return false
  }
}

// Function to create a new user
export async function createUser(userData: UserData): Promise<CreateUserResult> {
  try {
    // Check if user already exists
    const userExists = await checkUserExists(userData.email)

    if (userExists) {
      return {
        success: false,
        error: "Um usuário com este email já existe",
      }
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(userData.password, salt)

    // Prepare user data for storage
    const userToStore = {
      email: userData.email,
      fullName: userData.fullName,
      username: userData.username,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    }

    const token = process.env.GITHUB_TOKEN

    if (!token) {
      throw new Error("GitHub token not found")
    }

    // Get all issues from the repository
    const response = await fetch("https://api.github.com/repos/lumagarcia57/vida-saborosa/issues", {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch issues")
    }

    const issues = await response.json()

    // Find issue with title "Usuários"
    const usersIssue = issues.find((issue: any) => issue.title === "Usuários")

    if (usersIssue) {
      // Update existing issue
      const issueResponse = await fetch(
        `https://api.github.com/repos/lumagarcia57/vida-saborosa/issues/${usersIssue.number}`,
        {
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        },
      )

      if (!issueResponse.ok) {
        throw new Error("Failed to fetch issue details")
      }

      const issueDetails = await issueResponse.json()

      // Parse the issue body as JSON
      let users = []
      try {
        users = JSON.parse(issueDetails.body || "[]")
      } catch (error) {
        // If the body is not valid JSON, start with an empty array
      }

      // Add the new user
      users.push(userToStore)

      // Update the issue
      const updateResponse = await fetch(
        `https://api.github.com/repos/lumagarcia57/vida-saborosa/issues/${usersIssue.number}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            body: JSON.stringify(users, null, 2),
          }),
        },
      )

      if (!updateResponse.ok) {
        throw new Error("Failed to update issue")
      }
    } else {
      // Create new issue
      const createResponse = await fetch("https://api.github.com/repos/lumagarcia57/vida-saborosa/issues", {
        method: "POST",
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Usuários",
          body: JSON.stringify([userToStore], null, 2),
        }),
      })

      if (!createResponse.ok) {
        throw new Error("Failed to create issue")
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error creating user:", error)
    return {
      success: false,
      error: "Ocorreu um erro ao criar a conta. Tente novamente mais tarde.",
    }
  }
}

// Function to verify user credentials
export async function verifyUser(email: string, password: string): Promise<boolean> {
  try {
    const token = process.env.GITHUB_TOKEN

    if (!token) {
      throw new Error("GitHub token not found")
    }

    // Get all issues from the repository
    const response = await fetch("https://api.github.com/repos/lumagarcia57/vida-saborosa/issues", {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch issues")
    }

    const issues = await response.json()

    // Find issue with title "Usuários"
    const usersIssue = issues.find((issue: any) => issue.title === "Usuários")

    if (!usersIssue) {
      return false
    }

    // Get the issue body
    const issueResponse = await fetch(
      `https://api.github.com/repos/lumagarcia57/vida-saborosa/issues/${usersIssue.number}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    )

    if (!issueResponse.ok) {
      throw new Error("Failed to fetch issue details")
    }

    const issueDetails = await issueResponse.json()

    // Parse the issue body as JSON
    try {
      const users = JSON.parse(issueDetails.body || "[]")
      // Find user with the given email
      const user = users.find((u: any) => u.email === email)

      if (!user) {
        return false
      }

      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password)

      // If valid, set a login cookie
      if (isPasswordValid) {
        const cookieStore = await cookies()
        cookieStore.set("auth_token", "logged_in", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: "/",
        })

        cookieStore.set("user_email", email, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: "/",
        })
      }

      return isPasswordValid
    } catch (error) {
      console.error("Error parsing user data:", error)
      return false
    }
  } catch (error) {
    console.error("Error verifying user:", error)
    return false
  }
}

// Function to log out user
export async function logout() {
  const cookieStore = await cookies()
  // Clear auth cookies
  cookieStore.delete("auth_token")
  cookieStore.delete("user_email")

  return { success: true }
}

// Add this function to fetch user data by email
export async function getUserByEmail(email: string): Promise<any | null> {
  try {
    const token = process.env.GITHUB_TOKEN

    if (!token) {
      throw new Error("GitHub token not found")
    }

    // Get all issues from the repository
    const response = await fetch("https://api.github.com/repos/lumagarcia57/vida-saborosa/issues", {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch issues")
    }

    const issues = await response.json()

    // Find issue with title "Usuários"
    const usersIssue = issues.find((issue: any) => issue.title === "Usuários")

    if (!usersIssue) {
      return null
    }

    // Get the issue body
    const issueResponse = await fetch(
      `https://api.github.com/repos/lumagarcia57/vida-saborosa/issues/${usersIssue.number}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    )

    if (!issueResponse.ok) {
      throw new Error("Failed to fetch issue details")
    }

    const issueDetails = await issueResponse.json()

    // Parse the issue body as JSON
    try {
      const users = JSON.parse(issueDetails.body || "[]")
      // Find user with the given email
      const user = users.find((u: any) => u.email === email)
      return user || null
    } catch (error) {
      console.error("Error parsing user data:", error)
      return null
    }
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

// Add this function to update user password
export async function updateUserPassword(
  email: string,
  currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = process.env.GITHUB_TOKEN

    if (!token) {
      throw new Error("GitHub token not found")
    }

    // Get all issues from the repository
    const response = await fetch("https://api.github.com/repos/lumagarcia57/vida-saborosa/issues", {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch issues")
    }

    const issues = await response.json()

    // Find issue with title "Usuários"
    const usersIssue = issues.find((issue: any) => issue.title === "Usuários")

    if (!usersIssue) {
      return { success: false, error: "Usuários não encontrados" }
    }

    // Get the issue body
    const issueResponse = await fetch(
      `https://api.github.com/repos/lumagarcia57/vida-saborosa/issues/${usersIssue.number}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    )

    if (!issueResponse.ok) {
      throw new Error("Failed to fetch issue details")
    }

    const issueDetails = await issueResponse.json()

    // Parse the issue body as JSON
    try {
      const users = JSON.parse(issueDetails.body || "[]")
      // Find user with the given email
      const userIndex = users.findIndex((u: any) => u.email === email)

      if (userIndex === -1) {
        return { success: false, error: "Usuário não encontrado" }
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, users[userIndex].password)
      if (!isPasswordValid) {
        return { success: false, error: "Senha atual incorreta" }
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(newPassword, salt)

      // Update the password
      users[userIndex].password = hashedPassword

      // Update the issue
      const updateResponse = await fetch(
        `https://api.github.com/repos/lumagarcia57/vida-saborosa/issues/${usersIssue.number}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            body: JSON.stringify(users, null, 2),
          }),
        },
      )

      if (!updateResponse.ok) {
        throw new Error("Failed to update issue")
      }

      return { success: true }
    } catch (error) {
      console.error("Error updating password:", error)
      return { success: false, error: "Erro ao atualizar senha" }
    }
  } catch (error) {
    console.error("Error updating password:", error)
    return { success: false, error: "Erro ao atualizar senha" }
  }
}

// Update the updateUserSettings function to allow email changes
export async function updateUserSettings(userData: any, section: string) {
  try {
    const token = process.env.GITHUB_TOKEN
    const cookieStore = await cookies()
    const userEmail = cookieStore.get("user_email")?.value

    if (!token) {
      throw new Error("GitHub token not found")
    }

    if (!userEmail) {
      throw new Error("User not logged in")
    }

    // Get all issues from the repository
    const response = await fetch("https://api.github.com/repos/lumagarcia57/vida-saborosa/issues", {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch issues")
    }

    const issues = await response.json()

    // Find issue with title "Usuários"
    const usersIssue = issues.find((issue: any) => issue.title === "Usuários")

    if (!usersIssue) {
      throw new Error("Users issue not found")
    }

    // Get the issue body
    const issueResponse = await fetch(
      `https://api.github.com/repos/lumagarcia57/vida-saborosa/issues/${usersIssue.number}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    )

    if (!issueResponse.ok) {
      throw new Error("Failed to fetch issue details")
    }

    const issueDetails = await issueResponse.json()

    // Parse the issue body as JSON
    try {
      const users = JSON.parse(issueDetails.body || "[]")

      // Find user with the given email
      const userIndex = users.findIndex((u: any) => u.email === userEmail)

      if (userIndex === -1) {
        throw new Error("User not found")
      }

      // Update user data based on section
      switch (section) {
        case "profile":
          users[userIndex].fullName = userData.fullName
          users[userIndex].phone = userData.phone

          // If email is being changed, update the email and the cookie
          if (userData.email !== userEmail) {
            // Check if the new email already exists
            const emailExists = users.some((u: any, idx: number) => idx !== userIndex && u.email === userData.email)
            if (emailExists) {
              throw new Error("Este email já está em uso")
            }

            users[userIndex].email = userData.email

            const cookieStore = await cookies()

            // Update the cookie with the new email
            cookieStore.set("user_email", userData.email, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              maxAge: 60 * 60 * 24 * 7, // 1 week
              path: "/",
            })
          }
          break
        case "notifications":
          users[userIndex].notifications = userData.notifications
          break
        case "payment":
          users[userIndex].paymentMethods = userData.paymentMethods
          break
        case "security":
          users[userIndex].security = userData.security
          break
        default:
          // For other sections, just update the whole section
          users[userIndex][section] = userData[section]
      }

      // Update the issue
      const updateResponse = await fetch(
        `https://api.github.com/repos/lumagarcia57/vida-saborosa/issues/${usersIssue.number}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            body: JSON.stringify(users, null, 2),
          }),
        },
      )

      if (!updateResponse.ok) {
        throw new Error("Failed to update issue")
      }

      return { success: true }
    } catch (error) {
      console.error("Error updating user settings:", error)
      throw error
    }
  } catch (error) {
    console.error("Error updating user settings:", error)
    throw error
  }
}
