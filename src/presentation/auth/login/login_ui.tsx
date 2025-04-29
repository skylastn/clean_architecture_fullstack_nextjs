import { Form, Input, Button, Typography, Card } from "antd";
import Link from "next/link";
import { useLoginLogic } from "./login_logic";
import styles from "./login.module.css";

const { Title, Text } = Typography;

const LoginUI = () => {
  const {  setUsername, setPassword, handlerLogin } = useLoginLogic();

  // const onFinish = () => {
  //   handlerLogin();
  // };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 30 }}>Welcome Back</Title>

        <Form layout="vertical" onFinish={handlerLogin}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Masukkan username Anda!" }]}
            // initialValue={username}
          >
            <Input
              placeholder="Masukkan username"
              // value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Masukkan password Anda!" }]}
            // initialValue={password}
          >
            <Input.Password
              placeholder="Masukkan password"
              // value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Text>Belum punya akun? </Text>
          <Link href="/auth/register">Registrasi di sini</Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginUI;
