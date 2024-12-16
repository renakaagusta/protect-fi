
import React from "react";
import * as Label from "@radix-ui/react-label";
import { Button } from "@/components/button/button";
import { DateTime } from "luxon"; // Untuk memformat timestamp

interface InformationPoolProps {
    name: string;
    symbol: string;
    descriptionUri: string;
    url: string;
    encryptedUrlToken: string;
    encryptedApplicationID: string;
    encryptedApplicationSecret: string;
    approvedValue: string;
    regexValue: string;
    checkingLogic: string;
    benefit: number;
    startedAt: number; // uint256
    finishedAt: number; // uint256
    endOfPurchaseAt: number; // uint256
    maxPolicies: number;
}

const InformationPool: React.FC<InformationPoolProps> = ({
    name,
    symbol,
    descriptionUri,
    url,
    encryptedUrlToken,
    encryptedApplicationID,
    encryptedApplicationSecret,
    approvedValue,
    regexValue,
    checkingLogic,
    benefit,
    startedAt,
    finishedAt,
    endOfPurchaseAt,
    maxPolicies,
  }) => {
    return (
      <div className="bg-white dark:bg-[#131313] p-6 rounded-lg shadow-md space-y-6">
        <h2 className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-3xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">Pool Information</h2>
        <div className="space-y-4">
          {/* Name */}
          <div className="flex flex-col">
            <Label.Root className="font-medium text-md text-gray-700 dark:text-gray-300">Name:</Label.Root>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{name}</p>
          </div>
  
          {/* Symbol */}
          <div className="flex flex-col">
            <Label.Root className="font-medium text-md text-gray-700 dark:text-gray-300">Symbol:</Label.Root>
            <p className="text-sm text-gray-900 dark:text-gray-100">{symbol}</p>
          </div>
  
          {/* Description URI */}
          <div className="flex flex-col">
            <Label.Root className="font-medium text-md text-gray-700 dark:text-gray-300">Description URI:</Label.Root>
            <a
              href={descriptionUri}
              className="text-blue-500 dark:text-blue-400 hover:underline text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              {descriptionUri}
            </a>
          </div>
  
          {/* URL */}
          <div className="flex flex-col">
            <Label.Root className="font-medium text-md text-gray-700 dark:text-gray-300">URL:</Label.Root>
            <a
              href={url}
              className="text-blue-500 dark:text-blue-400 hover:underline text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              {url}
            </a>
          </div>
  
          {/* Encrypted URL Token */}
          <div className="flex flex-col">
            <Label.Root className="font-medium text-md text-gray-700 dark:text-gray-300">
              Encrypted URL Token:
            </Label.Root>
            <p className="text-sm text-gray-900 dark:text-gray-100">{encryptedUrlToken}</p>
          </div>
  
          {/* Encrypted Application ID */}
          <div className="flex flex-col">
            <Label.Root className="font-medium text-md text-gray-700 dark:text-gray-300">
              Encrypted Application ID:
            </Label.Root>
            <p className="text-sm text-gray-900 dark:text-gray-100">{encryptedApplicationID}</p>
          </div>
  
          {/* Encrypted Application Secret */}
          <div className="flex flex-col">
            <Label.Root className="font-medium text-md text-gray-700 dark:text-gray-300">
              Encrypted Application Secret:
            </Label.Root>
            <p className="text-sm text-gray-900 dark:text-gray-100">{encryptedApplicationSecret}</p>
          </div>
  
          {/* Approved Value */}
          <div className="flex flex-col">
            <Label.Root className="font-medium text-md text-gray-700 dark:text-gray-300">Approved Value:</Label.Root>
            <p className="text-sm text-gray-900 dark:text-gray-100">{approvedValue}</p>
          </div>
  
          {/* Regex Value */}
          <div className="flex flex-col">
            <Label.Root className="font-medium text-md text-gray-700 dark:text-gray-300">Regex Value:</Label.Root>
            <p className="text-sm text-gray-900 dark:text-gray-100">{regexValue}</p>
          </div>
  
          {/* Checking Logic */}
          <div className="flex flex-col">
            <Label.Root className="font-medium text-md text-gray-700 dark:text-gray-300">Checking Logic:</Label.Root>
            <p className="text-sm text-gray-900 dark:text-gray-100">{checkingLogic}</p>
          </div>
  
          {/* Coverage Amount */}
          <div className="flex flex-col">
            <Label.Root className="font-medium text-md text-gray-700 dark:text-gray-300">
              Coverage Amount:
            </Label.Root>
            <p className="text-sm text-gray-900 dark:text-gray-100">{benefit}</p>
          </div>
  
          {/* Started At */}
          <div className="flex flex-col">
            <Label.Root className="font-medium text-md text-gray-700 dark:text-gray-300">Started At:</Label.Root>
            <p className="text-sm text-gray-900 dark:text-gray-100">
              {DateTime.fromSeconds(startedAt).toFormat("dd LLL yyyy HH:mm")}
            </p>
          </div>
  
          {/* Finished At */}
          <div className="flex flex-col">
            <Label.Root className="font-medium text-md text-gray-700 dark:text-gray-300">Finished At:</Label.Root>
            <p className="text-sm text-gray-900 dark:text-gray-100">
              {DateTime.fromSeconds(finishedAt).toFormat("dd LLL yyyy HH:mm")}
            </p>
          </div>
  
          {/* End of Purchase At */}
          <div className="flex flex-col">
            <Label.Root className="font-medium text-md text-gray-700 dark:text-gray-300">
              End of Purchase At:
            </Label.Root>
            <p className="text-sm text-gray-900 dark:text-gray-100">
              {DateTime.fromSeconds(endOfPurchaseAt).toFormat("dd LLL yyyy HH:mm")}
            </p>
          </div>
  
          {/* Max Policies */}
          <div className="flex flex-col">
            <Label.Root className="font-medium text-md text-gray-700 dark:text-gray-300">Max Policies:</Label.Root>
            <p className="text-sm text-gray-900 dark:text-gray-100">{maxPolicies}</p>
          </div>
        </div>
        {/* <div className="flex justify-end mt-6">
          <Button variant="default">Manage Pool</Button>
        </div> */}
      </div>
    );
  };
  
  export default InformationPool;