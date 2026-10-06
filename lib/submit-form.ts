export async function submitForm(
  endpoint: string,
  payload: Record<string, string>,
) {
  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(28000),
    });
  } catch {
    throw new Error(
      "We couldn’t confirm your submission. Your details are still here. Check your connection and try again, or email us directly.",
    );
  }
  const result = (await response.json().catch(() => null)) as {
    ok?: boolean;
    message?: string;
  } | null;
  if (!response.ok || result?.ok !== true)
    throw new Error(
      result?.message ||
        "We couldn’t send your request. Please try again or email us directly.",
    );
  return result.message || "Thank you. Your request has been sent.";
}
