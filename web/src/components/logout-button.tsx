import Button from "@/components/button";

export function LogoutButton() {
    async function startBufferLogout() {
        window.location.href = '/api/auth/logout';
    }

    return (
        <Button onClick={startBufferLogout} variant="secondary">
            <span className="text-base text-gray-100">Disconnect</span>
        </Button>
    );
}