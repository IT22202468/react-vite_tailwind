import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import React from "react"
import { useLocation } from "react-router-dom"

const navigation = [
  { name: 'Upload Excel sheet', href: '/upload-excel' },
  { name: 'Graphical view', href: '/graphical-data' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const location = useLocation();
  return (
    <Disclosure as="nav" className="bg-gray-50 border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Left: Logo/Title */}
          <div className="flex flex-1 items-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <span className="font-bold text-2xl text-gray-900">NRIF Dashboard</span>
            </div>
          </div>
          {/* Right: Navigation and Profile */}
          <div className="flex items-center">
            <div className="hidden sm:flex sm:items-center">
              <div className="flex space-x-4">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={classNames(
                        isActive
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-700 hover:text-blue-600',
                        'rounded-md px-3 py-2 text-base font-medium bg-transparent border-none cursor-pointer transition-all duration-150'
                      )}
                      style={isActive ? { paddingBottom: '6px' } : {}}
                    >
                      {item.name}
                    </a>
                  );
                })}
              </div>
              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex rounded-full bg-gray-100 text-sm focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-gray-100 focus:outline-hidden">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="size-8 rounded-full"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                    >
                      Your Profile
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                    >
                      Sign out
                    </a>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
            {/* Mobile menu button */}
            <div className="flex sm:hidden">
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
              </DisclosureButton>
            </div>
          </div>
        </div>
      </div>
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <DisclosureButton
                key={item.name}
                as="a"
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={classNames(
                  isActive
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-blue-600',
                  'block rounded-md px-3 py-2 text-base font-medium bg-transparent border-none cursor-pointer transition-all duration-150'
                )}
                style={isActive ? { paddingBottom: '6px' } : {}}
              >
                {item.name}
              </DisclosureButton>
            );
          })}
          {/* Profile dropdown for mobile */}
          <Menu as="div" className="relative mt-2">
            <div>
              <MenuButton className="relative flex rounded-full bg-gray-100 text-sm focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-gray-100 focus:outline-hidden">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>
                <img
                  alt=""
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  className="size-8 rounded-full"
                />
              </MenuButton>
            </div>
            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                >
                  Your Profile
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                >
                  Sign out
                </a>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
