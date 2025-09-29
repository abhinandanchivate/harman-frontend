const extractMessage = (error) => {
  if (!error) return 'Something went wrong.';
  if (typeof error === 'string') return error;
  if (error?.data?.detail) return error.data.detail;
  if (error?.data?.message) return error.data.message;
  if (error?.error) return error.error;
  return 'Something went wrong.';
};

const extractDetails = (error) => {
  if (error?.data && typeof error.data === 'object') {
    return Object.entries(error.data)
      .filter(([key]) => key !== 'detail' && key !== 'message')
      .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`);
  }
  return [];
};

export default function ErrorBlock({ error }) {
  if (!error) return null;
  const message = extractMessage(error);
  const details = extractDetails(error);

  return (
    <div className="error-block" role="alert">
      <strong>{message}</strong>
      {details.length > 0 && (
        <ul>
          {details.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
