export function normalizeOpenAICompatibleError(message: string) {
  if (message.includes("Quota exceeded")) {
    return "The API key is valid, but this project currently has no usable quota or billing for image analysis.";
  }

  if (
    message.includes("unknown variant `image_url`") ||
    message.includes("expected `text`")
  ) {
    return "This API endpoint accepts text, but it does not support the image input format Pet Whisper needs for photo analysis.";
  }

  if (message.includes("No models loaded")) {
    return "The API is reachable, but the server has no model loaded yet. Load the model first, then try again.";
  }

  if (message.includes("invalid_request_error") && message.includes("Parameter: model")) {
    return "The API reached the server, but this model is unavailable there right now.";
  }

  return message;
}
