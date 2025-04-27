"use server"

import bcrypt from "bcryptjs"

type UserData = {
  email: string
  fullName: string
  username: string
  password: string
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
