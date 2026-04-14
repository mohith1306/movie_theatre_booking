export default function Alert({ type = "error", message }) {
  if (!message) {
    return null;
  }

  const className = type === "success" ? "text-green-400" : "error-text";
  return <div className={`mb-4 ${className}`}>{message}</div>;
}
