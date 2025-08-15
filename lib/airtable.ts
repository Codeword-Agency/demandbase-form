interface AirtableRecord {
  name?: string
  company?: string
  message: string
  voiceRecording?: File
}

interface AirtableResponse {
  id: string
  fields: Record<string, any>
  createdTime: string
}

export async function createAirtableRecord(data: AirtableRecord): Promise<AirtableResponse> {
  const baseId = process.env.AIRTABLE_BASE_ID
  const tableId = process.env.AIRTABLE_TABLE_ID
  const personalAccessToken = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN

  if (!baseId || !tableId || !personalAccessToken) {
    throw new Error("Missing Airtable configuration. Please check your environment variables.")
  }

  console.log("[v0] Creating Airtable record with data:", {
    name: data.name,
    company: data.company,
    message: data.message?.substring(0, 50) + "...",
    hasVoiceRecording: !!data.voiceRecording,
  })

  try {
    const url = `https://api.airtable.com/v0/${baseId}/${tableId}`

    // Prepare the fields for Airtable
    const fields: Record<string, any> = {
      Name: data.name || "",
      Company: data.company || "",
      Message: data.message,
    }

    // If there's a voice recording, we'll handle it as an attachment
    if (data.voiceRecording) {
      // Convert File to base64 for Airtable attachment
      const arrayBuffer = await data.voiceRecording.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString("base64")

      fields["Voice Recording"] = [
        {
          filename: `voice-memo-${Date.now()}.webm`,
          content: base64,
          contentType: "audio/webm",
        },
      ]
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${personalAccessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[v0] Airtable API error:", errorData)
      throw new Error(`Airtable API error: ${errorData.error?.message || response.statusText}`)
    }

    const result = await response.json()
    console.log("[v0] Airtable record created successfully:", result.id)

    return result
  } catch (error) {
    console.error("[v0] Failed to create Airtable record:", error)
    throw error
  }
}

export async function validateAirtableConfig(): Promise<boolean> {
  const baseId = process.env.AIRTABLE_BASE_ID
  const tableId = process.env.AIRTABLE_TABLE_ID
  const personalAccessToken = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN

  if (!baseId || !tableId || !personalAccessToken) {
    console.error("[v0] Missing Airtable environment variables:", {
      hasBaseId: !!baseId,
      hasTableId: !!tableId,
      hasPersonalAccessToken: !!personalAccessToken,
    })
    const missingVars = []
    if (!baseId) missingVars.push("AIRTABLE_BASE_ID")
    if (!tableId) missingVars.push("AIRTABLE_TABLE_ID")
    if (!personalAccessToken) missingVars.push("AIRTABLE_PERSONAL_ACCESS_TOKEN")
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`)
  }

  try {
    const url = `https://api.airtable.com/v0/meta/bases/${baseId}/tables`
    console.log("[v0] Testing Airtable connection with URL:", url)

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${personalAccessToken}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Airtable connection test failed:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        baseId: baseId,
        tableId: tableId,
      })
      if (response.status === 401) {
        throw new Error("Invalid AIRTABLE_PERSONAL_ACCESS_TOKEN - check your token permissions")
      } else if (response.status === 403) {
        throw new Error(
          "Access forbidden - your Personal Access Token needs 'data.records:write' and 'schema.bases:read' scopes for this base. Please regenerate your token with the correct permissions.",
        )
      } else if (response.status === 404) {
        throw new Error("Invalid AIRTABLE_BASE_ID - base not found or no access")
      } else {
        throw new Error(`Airtable API error: ${response.status} ${response.statusText}`)
      }
    }

    const data = await response.json()
    console.log(
      "[v0] Available tables:",
      data.tables?.map((t: any) => ({ id: t.id, name: t.name })),
    )

    const tableExists = data.tables?.some((table: any) => table.id === tableId || table.name === tableId)

    if (!tableExists) {
      console.error(
        "[v0] Table not found. Available tables:",
        data.tables?.map((t: any) => t.name),
      )
      const availableTableNames = data.tables?.map((t: any) => t.name).join(", ") || "none"
      throw new Error(`Table '${tableId}' not found. Available tables: ${availableTableNames}`)
    }

    console.log("[v0] Airtable connection test successful")
    return true
  } catch (error) {
    console.error("[v0] Airtable connection test error:", error)
    throw error
  }
}
