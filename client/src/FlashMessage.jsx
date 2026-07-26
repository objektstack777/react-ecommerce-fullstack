import { useFlashMessage } from './FlashMessageStore';

export default function FlashMessage() {
  const { flashMessage } = useFlashMessage();

  if (!flashMessage.message) {
    return null;
  }

  return (
    <div
      className={`flash-alert alert alert-${flashMessage.type}`}
      role="alert"
    >
      {flashMessage.message}
    </div>
  );
}