'use client';

import Button from "@/components/button";

type LogoutButtonProps = {
    fullWidth?: boolean;
};

export function LogoutButton({ fullWidth }: LogoutButtonProps) {
    async function startBufferLogout() {
        window.location.href = '/api/auth/logout';
    }

    return (
        <Button
            onClick={startBufferLogout}
            variant="secondary"
            className={fullWidth ? 'w-full' : ''}
        >
            <span className="text-base text-gray-100">Disconnect</span>
        </Button>
    );
}