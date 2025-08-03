import Link from "next/link";
import { Button } from "@mantine/core";

import NotFoundImage from "@@/images/404.svg";

export default function NotFound() {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen p-4 lg:p-8">
      <div className="flex-1 max-w-md lg:max-w-lg xl:max-w-xl mb-8 lg:mb-0 lg:mr-8">
        <NotFoundImage className="w-full h-auto" />
      </div>

      <div className="flex-1 max-w-md lg:max-w-lg text-center lg:text-left">
        <div className="bg-gray-100 rounded-lg p-6 lg:p-8 shadow-lg">
          <h1 className="font-semibold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl mb-4 text-gray-800">
            Uh-oh! A Thief Took This Page!
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl font-normal text-blue-aura mb-6 lg:mb-8 leading-relaxed">
            Looks like a sneaky thief ran off with this page! But don&apos;t
            worry, you can find your way back.
          </p>
          <Button
            className="w-full sm:w-auto px-8 py-3 text-lg font-medium"
            component={Link}
            href="/"
            variant="filled"
            size="lg"
          >
            Go Back Home
          </Button>
        </div>
      </div>
    </div>
  );
}
