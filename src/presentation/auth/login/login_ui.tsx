import Image from "next/image";
import Link from "next/link";
import { Form, Input, Button, Typography } from "antd";
import authIllustration from "../../../../public/auth/auth.png";
import logoSky from "../../../../public/auth/logo_sky.png";
import { useLoginLogic } from "./login_logic";
const { Title, Text } = Typography;

const LoginUI = () => {
  const { username, setUsername, password, setPassword, handlerLogin } =
    useLoginLogic();

  return (
    <div className="flex flex-col items-center justify-center h-[100vh]">
      <div className="bg-white p-6 rounded shadow-lg mt-6 w-full max-w-md">
        <div className="flex items-center space-x-4 mb-6 justify-between">
          <Image
            src={logoSky}
            style={{ marginLeft: 20 }}
            alt="logo"
            width={50}
            height={50}
          />
          <Title level={3}>Login</Title>
          <Image
            src={authIllustration}
            alt="illustration"
            width={100}
            height={100}
          />
        </div>

        <Form layout="vertical" onFinish={handlerLogin} style={{ padding: 30 }}>
          <Form.Item label="Username" name="username">
            <Input
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              style={{ height: 40 }}
            />
          </Form.Item>

          <Form.Item label="Password" name="password">
            <Input.Password
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              style={{ height: 40 }}
            />
            <div className="flex justify-end mt-2">
              <Text>Belum punya akun? </Text>
              <Link
                href="/auth/register"
                className="text-red-600 font-semibold ml-1"
              >
                Register
              </Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                height: 40,
                backgroundColor: "#367614",
                borderColor: "#367614",
              }}
              block
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginUI;
