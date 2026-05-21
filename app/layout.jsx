export const metadata = {
  title: 'между — третий, кто слушает обоих',
  description: 'AI-собеседник для разговоров о чувствах, ссорах и отношениях. Не терапевт. Эмоциональный переводчик и зеркало паттернов.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
