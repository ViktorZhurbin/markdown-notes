import { Button, Center, Stack, Text, TextInput } from "@mantine/core";
import { useState } from "react";
import { db } from "../../db/instant";

export const Login = () => {
  const [sentEmail, setSentEmail] = useState("");

  return (
    <Center h="100vh">
      <Stack w={280} gap="md">
        {sentEmail ? (
          <CodeStep email={sentEmail} onBack={() => setSentEmail("")} />
        ) : (
          <EmailStep onSent={setSentEmail} />
        )}
      </Stack>
    </Center>
  );
};

const EmailStep = ({ onSent }: { onSent: (email: string) => void }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const sendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    db.auth
      .sendMagicCode({ email })
      .then(() => onSent(email))
      .catch((err) => setError(err.body?.message ?? "Failed to send code"));
  };

  return (
    <form onSubmit={sendCode}>
      <Stack gap="sm">
        <Text size="sm" c="dimmed">
          Enter your email to sign in
        </Text>
        <TextInput
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          error={error}
          required
          autoFocus
        />
        <Button type="submit">Send code</Button>
      </Stack>
    </form>
  );
};

const CodeStep = ({ email, onBack }: { email: string; onBack: () => void }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const verifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    db.auth
      .signInWithMagicCode({ email, code })
      .catch((err) => setError(err.body?.message ?? "Invalid code"));
  };

  return (
    <form onSubmit={verifyCode}>
      <Stack gap="sm">
        <Text size="sm" c="dimmed">
          Enter the code sent to {email}
        </Text>
        <TextInput
          placeholder="123456"
          value={code}
          onChange={(e) => setCode(e.currentTarget.value)}
          error={error}
          required
          autoFocus
        />
        <Button type="submit">Verify</Button>
        <Button variant="subtle" onClick={onBack}>
          Back
        </Button>
      </Stack>
    </form>
  );
};
