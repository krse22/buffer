import Button from "@/components/button";

export function LoginButton() {
    async function startBufferLogin() {
        window.location.href = '/api/auth/login';
    }

    return (
        <Button onClick={startBufferLogin}>
            <span className="text-base text-gray-100">Connect <span className="font-bold underline">buffer.com</span></span>
        </Button>
    );
}