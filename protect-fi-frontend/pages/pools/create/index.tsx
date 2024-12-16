import { Button } from "@/components/button/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/form/form";
import { Input } from "@/components/input/input";
import SuccessDialog from "@/components/success-dialog/success-dialog";
import TokenInput, { parseTokenInput, tokenNumberSchema } from "@/components/token-input/token-input";
import { Textarea } from "@/components/ui/textarea";
import ClientWrapper from "@/components/wrapper/client-wrapper";
import { useCreateInsurancePool } from "@/hooks/web3/insurance/useCreateInsurancePool";
import { useOperatorPublicKey } from "@/hooks/web3/insurance/useOperatorPublicKey";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { encrypt } from "eciesjs";
import { Loader2 } from "lucide-react";
import { DateTime } from 'luxon';
import { NextPage } from "next";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { z } from "zod";

const poolFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    symbol: z.string().min(1, "Symbol is required"),
    descriptionUri: z.string().url("Must be a valid URL"),
    exampleResponseUri: z.string().url("Must be a valid URL"),
    curl: z.string().min(1, "CURL command is required"),
    secretKey: z.string().optional(),
    applicationID: z.string().min(1, "Application ID is required"),
    applicationSecret: z.string().min(1, "Application Secret is required"),
    regexValidation: z.string().min(1, "Regex validation pattern is required"),
    regexExtraction: z.string().min(1, "Regex extraction pattern is required"),
    claimFee: tokenNumberSchema
        .refine(
            (val) => {
                const { value } = parseTokenInput(val);
                return value !== null && value > 0;
            },
            "Amount must be greater than 0"
        ),
    benefit: z.number().min(0, "Benefit must be non-negative"),
    startedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "Invalid date format"),
    finishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "Invalid date format"),
    endOfPurchaseAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "Invalid date format"),
    maxPolicies: tokenNumberSchema
        .refine(
            (val) => {
                const { value } = parseTokenInput(val);
                return value !== null && value > 0;
            },
            "Amount must be greater than 0"
        ),
}).refine((data) => {
    const started = new Date(data.startedAt);
    const finished = new Date(data.finishedAt);
    const endOfPurchase = new Date(data.endOfPurchaseAt);

    return started < finished && started < endOfPurchase;
}, {
    message: "Start date must be before finish date and end of purchase date",
    path: ["startedAt"],
});

type PoolFormData = z.infer<typeof poolFormSchema>;

const CreatePool: NextPage = () => {
    const { address: userAddress, isConnected } = useAccount();

    const { operatorPublicKey, error: operatorPublicKeyError } = useOperatorPublicKey();
    const {
        isCreateInsurancePoolConfirming,
        createPoolHash,
        isPurchasePolicyAlertOpen,
        setIsPurchasePolicyAlertOpen,
        handleCreateInsurancePool,
    } = useCreateInsurancePool();

    const form = useForm<PoolFormData>({
        resolver: zodResolver(poolFormSchema),
        defaultValues: {
            claimFee: '0',
            benefit: 0,
            maxPolicies: '1',
            startedAt: DateTime.now().toFormat("yyyy-MM-dd'T'HH:mm"),
            finishedAt: DateTime.now().plus({ days: 30 }).toFormat("yyyy-MM-dd'T'HH:mm"),
            endOfPurchaseAt: DateTime.now().plus({ days: 15 }).toFormat("yyyy-MM-dd'T'HH:mm"),
        },
    });

    const onSubmit = (data: PoolFormData) => {
        if (!isConnected) {
            alert("Please connect your wallet first.");
            return;
        }

        if (!operatorPublicKey) {
            return;
        }

        const {
            name, symbol, descriptionUri, exampleResponseUri, curl, secretKey, applicationID, applicationSecret, regexExtraction, regexValidation, claimFee, benefit, startedAt, finishedAt, endOfPurchaseAt, maxPolicies
        } = data;

        const encoder = new TextEncoder();
        const encryptedApplicationID = encrypt(operatorPublicKey, encoder.encode(applicationID))
        const encryptedApplicationSecret = encrypt(operatorPublicKey, encoder.encode(applicationSecret))
        const encryptedCurlSecretKey = encrypt(operatorPublicKey, encoder.encode(secretKey))

        const { value: claimFeeParsed, error: claimFeeError } = parseTokenInput(claimFee);
        const { value: maxPoliciesParsed, error: maxPolicieseError } = parseTokenInput(maxPolicies);

        if (claimFeeError) {
            toast.info('Error parsing claim fee')
            return;
        }

        if (maxPolicieseError) {
            toast.info('Error parsing max policies')
            return;
        }

        console.log({
            name,
            symbol,
            descriptionUri,
            exampleResponseUri,
            curl,
            encryptedCurlSecretKey: encryptedCurlSecretKey.toString('hex'),
            encryptedApplicationID: encryptedApplicationID.toString('hex'),
            encryptedApplicationSecret: encryptedApplicationSecret.toString('hex'),
            regexExtraction,
            regexValidation,
            claimFee: Number(claimFeeParsed) * 1e18,
            benefit,
            startedAt: DateTime.fromISO(startedAt).toMillis(),
            finishedAt: DateTime.fromISO(finishedAt).toMillis(),
            endOfPurchaseAt: DateTime.fromISO(endOfPurchaseAt).toMillis(),
            maxPolicies: Number(maxPoliciesParsed) * 1e18
        })
        handleCreateInsurancePool(
            name,
            symbol,
            descriptionUri,
            exampleResponseUri,
            curl,
            encryptedCurlSecretKey.toString('hex'),
            encryptedApplicationID.toString('hex'),
            encryptedApplicationSecret.toString('hex'),
            regexExtraction,
            regexValidation,
            Number(claimFeeParsed) * 1e18,
            benefit,
            DateTime.fromISO(startedAt).toMillis(),
            DateTime.fromISO(finishedAt).toMillis(),
            DateTime.fromISO(endOfPurchaseAt).toMillis(),
            Number(maxPoliciesParsed) * 1e18,
        );
    };

    return (
        <main>
            <ClientWrapper>
                <div className="mt-[2rem] rounded-lg  flex flex-col justify-center w-full lg:px-[5vw] mx-auto z-10">
                    {/* Header */}
                    <div className="flex justify-center items-center mb-10">
                        <div>
                            <h1 className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-600/80 bg-clip-text text-center text-6xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-500/50">Create Pool</h1>
                            <p className="text-lg text-gray-500 mt-2 text-center">
                                Create a new insurance pool
                            </p>
                        </div>
                    </div>
                    <div className="w-full flex justify-center items-center">
                        <div className="bg-white dark:bg-[#161a1d] shadow-lg rounded-lg p-6 w-full max-w-xl">
                            <div
                                className={` ${!isConnected ? "opacity-20 pointer-events-none" : "opacity-100"}`}
                            >
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Name</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="symbol"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Symbol</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="descriptionUri"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Description URI</FormLabel>
                                                    <FormControl>
                                                        <Input type="url" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="exampleResponseUri"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Example Response URI</FormLabel>
                                                    <FormControl>
                                                        <Input type="url" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="curl"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>CURL Command</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            className="font-mono"
                                                            rows={3}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="secretKey"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Secret key</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="applicationID"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Application ID</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="applicationSecret"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Application Secret</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="regexExtraction"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Regex Extraction Pattern</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />


                                        <FormField
                                            control={form.control}
                                            name="regexValidation"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Regex Validation Pattern</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="claimFee"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Claim Fee</FormLabel>
                                                    <FormControl>
                                                        <TokenInput
                                                            {...field}
                                                            symbol="USDe"
                                                            onChange={e => field.onChange(e.target.value)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="benefit"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Benefit</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            step="1"
                                                            {...field}
                                                            onChange={e => field.onChange(parseFloat(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="maxPolicies"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Maximum Policies</FormLabel>
                                                    <FormControl>
                                                        <TokenInput
                                                            {...field}
                                                            symbol={form.getValues().symbol}
                                                            onChange={e => field.onChange(e.target.value)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="flex flex-row justify-between gap-2">
                                            <FormField
                                                control={form.control}
                                                name="startedAt"
                                                render={({ field }) => (
                                                    <FormItem
                                                        className="flex-1">
                                                        <FormLabel>Start Date</FormLabel>
                                                        <FormControl>
                                                            <Input type="datetime-local" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="finishedAt"
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormLabel>Finish Date</FormLabel>
                                                        <FormControl>
                                                            <Input type="datetime-local" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="endOfPurchaseAt"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>End of Purchase Date</FormLabel>
                                                    <FormControl>
                                                        <Input type="datetime-local" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Submit Button */}
                                        <div className="flex justify-center">
                                            {isConnected ? (
                                                <Button variant="default" type="submit" className="w-[100%] mt-4" disabled={isCreateInsurancePoolConfirming}>{isCreateInsurancePoolConfirming ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <></>}
                                                    Create Pool</Button>
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                    </form>
                                </Form>
                            </div>
                            {!isConnected && (
                                <div className="flex justify-center">
                                    <ConnectButton />
                                </div>
                            )}
                        </div>
                    </div>

                    <SuccessDialog
                        open={isPurchasePolicyAlertOpen}
                        onOpenChange={setIsPurchasePolicyAlertOpen}
                        txHash={createPoolHash}
                        isLoading={isCreateInsurancePoolConfirming}
                    />
                </div>
            </ClientWrapper>
        </main>
    );
};

export default CreatePool;