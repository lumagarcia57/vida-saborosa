"use server"

import ensureError from "@/lib/ensure-error"
import bcrypt from "bcryptjs"
import * as fs from "fs/promises"
import { cookies } from "next/headers"
import * as path from "path"

const USERS_FILE_PATH = path.join(process.cwd(), "data/users.json")

type User = {
  email: string
  fullName: string
  username: string
  password: string
  createdAt: string
}

/**
 * Reads the users data from the local JSON file.
 * @returns A promise that resolves to an array of User objects.
 */
async function readUsersFile(): Promise<User[]> {
  try {
    const data = await fs.readFile(USERS_FILE_PATH, "utf-8")
    return JSON.parse(data) as User[]
  } catch (err) {
    const error = ensureError(err);
    // If file doesn't exist or is empty/invalid JSON, return an empty array
    if (error.cause === "ENOENT") {
      return []
    }
    console.error("Error reading users file:", error)
    return []
  }
}

/**
 * Writes the users data to the local JSON file.
 * @param users The array of User objects to write.
 * @returns A promise that resolves when the write operation is complete.
 */
async function writeUsersFile(users: User[]): Promise<void> {
  try {
    await fs.writeFile(USERS_FILE_PATH, JSON.stringify(users, null, 2), "utf-8")
  } catch (error) {
    console.error("Error writing users file:", error)
    throw new Error("Failed to save user data locally.")
  }
}

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
    const users = await readUsersFile()
    return users.some((user) => user.email === email)
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
    const userToStore: User = {
      email: userData.email,
      fullName: userData.fullName,
      username: userData.username,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    }

    // Read existing users
    const users = await readUsersFile()

    // Add the new user
    users.push(userToStore)

    // Write back to the file
    await writeUsersFile(users)

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
    const users = await readUsersFile()
    // Find user with the given email
    const user = users.find((u) => u.email === email)

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
    console.error("Error verifying user:", error)
    return false
  }
}

// Function to log out user
export async function logout() {
  // Clear auth cookies
  const cookieStore = await cookies()
  cookieStore.delete("auth_token")
  cookieStore.delete("user_email")

  return { success: true }
}

// Add this function to fetch user data by email
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const users = await readUsersFile()
    // Find user with the given email
    const user = users.find((u) => u.email === email)
    return user || null
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

            // Update the cookie with the new email
            const cookieStore = await cookies()
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
