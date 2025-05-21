import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FeedbackForm } from "./FeedbackForm";

// Используем фейковый таймер для контроля setTimeout
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test("Проверка заголовка", () => {
  render(<FeedbackForm />);
  expect(screen.getByText("Обратная связь")).toBeInTheDocument();
});

test("Ввод имени и сообщения", async () => {
  render(<FeedbackForm />);
  const nameInput = screen.getByPlaceholderText("Ваше имя");
  const messageTextarea = screen.getByPlaceholderText("Ваше сообщение");

  await userEvent.type(nameInput, "Алексей");
  await userEvent.type(messageTextarea, "Привет!");

  expect(nameInput).toHaveValue("Алексей");
  expect(messageTextarea).toHaveValue("Привет!");
});

test("Отправка формы с валидными данными", async () => {
  render(<FeedbackForm />);
  const nameInput = screen.getByPlaceholderText("Ваше имя");
  const messageTextarea = screen.getByPlaceholderText("Ваше сообщение");
  const sendButton = screen.getByText("Отправить");

  await userEvent.type(nameInput, "Анна");
  await userEvent.type(messageTextarea, "Спасибо за помощь!");
  await userEvent.click(sendButton);

  // Проматываем таймер (имитируем задержку 1.5 сек)
  jest.advanceTimersByTime(1500);

  const successMessage = await screen.findByText("Спасибо, Анна! Ваше сообщение отправлено.");
  expect(successMessage).toBeInTheDocument();
});

test("Сообщение не появляется при пустом вводе", async () => {
  render(<FeedbackForm />);
  const sendButton = screen.getByText("Отправить");
  await userEvent.click(sendButton);

  jest.advanceTimersByTime(1500);

  const successMessage = screen.queryByText(/Ваше сообщение отправлено/);
  expect(successMessage).not.toBeInTheDocument();
});

test("Проверка, что кнопка существует и активна", () => {
  render(<FeedbackForm />);
  const button = screen.getByText("Отправить");
  expect(button).toBeInTheDocument();
  expect(button).toBeEnabled();
});

test("Trim-валидация: пробелы не проходят", async () => {
  render(<FeedbackForm />);
  const nameInput = screen.getByPlaceholderText("Ваше имя");
  const messageTextarea = screen.getByPlaceholderText("Ваше сообщение");
  const sendButton = screen.getByText("Отправить");

  await userEvent.type(nameInput, "   ");
  await userEvent.type(messageTextarea, "   ");
  await userEvent.click(sendButton);

  jest.advanceTimersByTime(1500);

  const successMessage = screen.queryByText(/Ваше сообщение отправлено/);
  expect(successMessage).not.toBeInTheDocument();
});
