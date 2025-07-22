import React from "react";
import { message, Popconfirm } from "antd";
import { Crown } from "lucide-react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import { MY_CONTRACT_ADDRESS, MY_CONTRACT_ABI } from "@/abis/contractABI";
import jobsApi from "@/api/jobsApi";
import { FinalChoiceProps } from "../types";

const FinalChoice: React.FC<FinalChoiceProps> = (props) => {
  const { selectedAgent, jobId, loadJobDetails } = props;
  const { address } = useAccount();
  // 合约写入
  const { writeContract } = useWriteContract();

  // 合约读取 - 用户在合约中的余额
  const { data: userContractBalance } = useReadContract({
    address: MY_CONTRACT_ADDRESS,
    abi: MY_CONTRACT_ABI,
    functionName: "getBalance",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!MY_CONTRACT_ADDRESS,
    },
  });

  // 给选中的agent打钱
  const handleTradeAgent = async (pricePerCall: string) => {
    if (!pricePerCall || !address) {
      message.error("请输入有效的提款金额");
      return;
    }

    try {
      // USDT 通常使用 6 位小数
      const amount = parseUnits(pricePerCall, 6);
      if (userContractBalance && amount > userContractBalance) {
        message.error("合约余额不足");
        return;
      }

      writeContract({
        address: MY_CONTRACT_ADDRESS,
        abi: MY_CONTRACT_ABI,
        functionName: "withdrawUSDT",
        args: [amount],
      });

      message.success("交易成功");
    } catch (error) {
      message.error("交易失败");
    }
  };

  const handleChoice = async () => {
    // await handleTradeAgent(String(selectedAgent.pricePerCall));
    await jobsApi.selectFinalAgent(jobId, selectedAgent.id);

    loadJobDetails(jobId);
  };

  return (
    <Popconfirm title="确定选择这个agent吗?" onConfirm={handleChoice}>
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-50 border border-yellow-300 rounded text-yellow-800 hover:bg-yellow-100 transition-colors duration-200 text-xs font-medium cursor-pointer">
        <Crown size={16} strokeWidth={1} />
        Final Choice
      </div>
    </Popconfirm>
  );
};

export default FinalChoice;
