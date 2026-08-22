'use client'
import { NavigationMenu } from '@base-ui/react/navigation-menu';
import { ChevronDown } from 'lucide-react';

export default function MainNavbar() {
    return (
        <header className="border-b border-gray-200 bg-white">
            <nav className="mx-auto flex items-center justify-between p-4 text-gray-900">
                <div><span className="font-bold">HELLO</span>, Buffer :)</div>
                <NavigationMenu.Root>
                    <NavigationMenu.List>
                        <NavigationMenu.Item>
                            <NavigationMenu.Trigger className="flex items-center gap-1 cursor-pointer font-medium hover:text-blue-600">
                                Overview
                                <NavigationMenu.Icon>
                                    <ChevronDown className="w-4 h-4 transition-transform duration-200 [[data-panel-open]_&]:rotate-180" />
                                </NavigationMenu.Icon>
                            </NavigationMenu.Trigger>
                            <NavigationMenu.Content className="mt-2 w-48 bg-white p-2 shadow-md border border-gray-200">
                                <ul>
                                    <li>
                                        <a href="#" className="block p-2 hover:bg-gray-100 rounded">
                                            Hello world
                                        </a>
                                    </li>
                                </ul>
                            </NavigationMenu.Content>
                        </NavigationMenu.Item>
                    </NavigationMenu.List>

                    <NavigationMenu.Portal>
                        <NavigationMenu.Positioner
                            className=""
                            sideOffset={10}
                            collisionPadding={{ top: 5, bottom: 5, left: 20, right: 20 }}
                            collisionAvoidance={{ side: 'none' }}
                        >
                            <NavigationMenu.Popup className="">
                                <NavigationMenu.Arrow className="" />
                                <NavigationMenu.Viewport className="" />
                            </NavigationMenu.Popup>
                        </NavigationMenu.Positioner>
                    </NavigationMenu.Portal>
                </NavigationMenu.Root>
            </nav>
        </header>
    );
}