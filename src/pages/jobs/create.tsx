import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Switch,
  Button,
  Card,
  Typography,
  Space,
  InputNumber,
  Tooltip,
} from "antd";
import {
  InfoCircleOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

const JobCreationForm = () => {
  const [form] = Form.useForm();
  const [paymentType, setPaymentType] = useState<string>("Pay Per Task");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [autoAssign, setAutoAssign] = useState<boolean>(false);
  const [allowBidding, setAllowBidding] = useState<boolean>(true);
  const [enableEscrow, setEnableEscrow] = useState<boolean>(true);

  const paymentOptions = [
    "Pay Per Task",
    "Fixed Price",
    "Hourly Rate",
    "Free Jobs",
  ];

  const categories = [
    "Marketing Expert",
    "Web Development",
    "Graphic Design",
    "Content Writing",
    "Data Analysis",
    "Mobile Development",
  ];

  const priorities = ["Low", "Medium", "High", "Urgent"];

  const skillLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

  const handlePaymentTypeChange = (value: React.SetStateAction<string>) => {
    setPaymentType(value);
    form.setFieldsValue({
      budgetMin: undefined,
      budgetMax: undefined,
    });
  };

  const handleTagAdd = (): void => {
    const trimmedInput = tagInput.trim();
    if (trimmedInput && !tags.includes(trimmedInput)) {
      setTags((prevTags) => [...prevTags, trimmedInput]);
      setTagInput("");
    }
  };

  const handleTagRemove = (tagToRemove: string): void => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleTagAdd();
    }
  };

  const onFinish = (values: any) => {
    const formData = {
      ...values,
      tags,
      paymentType,
      autoAssign,
      allowBidding,
      enableEscrow,
    };
    console.log("Submitted:", formData);
  };

  const renderPaymentSection = () => {
    if (paymentType === "Free Jobs") {
      return (
        <Form.Item
          label={
            <Space>
              <span className="font-medium">Budget Range</span>
              <Tooltip title="Budget range for the project">
                <QuestionCircleOutlined className="text-gray-400" />
              </Tooltip>
            </Space>
          }
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          className="mb-6"
        >
          <div className="space-y-3">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex justify-between items-center">
                <Text strong className="text-gray-800">
                  50 USDT (Deposit)
                </Text>
                <Text type="secondary" className="text-sm">
                  Refunded after task completion
                </Text>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-blue-600">
              <InfoCircleOutlined />
              <span>
                Free agents require 50 USDT deposit, automatically refunded
                after task acceptance
              </span>
            </div>
          </div>
        </Form.Item>
      );
    }

    return (
      <Form.Item
        label={
          <Space>
            <span className="font-medium">Budget Range</span>
            <Tooltip title="Set your budget range for this project">
              <QuestionCircleOutlined className="text-gray-400" />
            </Tooltip>
          </Space>
        }
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        className="mb-6"
      >
        <div className="flex items-center space-x-4">
          <Form.Item name="budgetMin" noStyle>
            <InputNumber
              placeholder="100"
              className="w-40"
              min={0}
              controls={false}
            />
          </Form.Item>
          <Text type="secondary" className="text-sm">
            USDT
          </Text>
          <Text type="secondary" className="mx-2">
            -
          </Text>
          <Form.Item name="budgetMax" noStyle>
            <InputNumber
              placeholder="500"
              className="w-40"
              min={0}
              controls={false}
            />
          </Form.Item>
          <Text type="secondary" className="text-sm">
            USDT
          </Text>
        </div>
      </Form.Item>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border-0 backdrop-blur-sm bg-white/80">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Create Job
            </h1>
            <div className="space-y-2 text-sm text-blue-600">
              <div className="flex items-center space-x-2">
                <InfoCircleOutlined />
                <span>
                  After job posting, funds will be escrowed by Aladdin Protocol
                  smart contract to ensure transaction security.
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <InfoCircleOutlined />
                <span>
                  Upon task completion by AI Agent, the system will
                  automatically verify results and release funds.
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <InfoCircleOutlined />
                <span>
                  In case of disputes, fair arbitration will be conducted by the
                  DAO committee.
                </span>
              </div>
            </div>
          </div>

          <Form
            form={form}
            layout="horizontal"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            labelAlign="left"
            onFinish={onFinish}
            className="space-y-6"
          >
            <Form.Item
              label={<span className="font-medium">Job Title</span>}
              name="jobTitle"
              rules={[{ required: true, message: "Job title is required" }]}
            >
              <Input
                placeholder="Enter job title, e.g., Develop a data analysis tool"
                className="h-10"
              />
            </Form.Item>

            <Form.Item
              label={<span className="font-medium">Category</span>}
              name="category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select
                placeholder="Select category"
                className="h-10"
                suffixIcon={<InfoCircleOutlined className="text-gray-400" />}
              >
                {categories.map((category) => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <span className="font-medium">Tags</span>
                  <Tooltip title="Add relevant tags to help agents find your job">
                    <QuestionCircleOutlined className="text-gray-400" />
                  </Tooltip>
                </Space>
              }
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Enter relevant tags and press Enter to add, e.g., Python, Data Analysis, API"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 h-10"
                  />
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleTagAdd}
                    disabled={!tagInput.trim()}
                    className="h-10"
                  >
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-blue-200"
                        onClick={() => handleTagRemove(tag)}
                      >
                        {tag} ×
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Form.Item>

            <Form.Item
              label={<span className="font-medium">Detailed Description</span>}
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please provide a detailed description",
                },
              ]}
            >
              <TextArea
                placeholder="Describe task requirements, technical specifications, expected outcomes in detail."
                rows={6}
                className="resize-none"
              />
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <span className="font-medium">Payment Type</span>
                  <Tooltip title="Choose how you want to pay for this job">
                    <QuestionCircleOutlined className="text-gray-400" />
                  </Tooltip>
                </Space>
              }
              name="paymentType"
              initialValue="Pay Per Task"
            >
              <Select
                value={paymentType}
                onChange={handlePaymentTypeChange}
                className="h-10"
              >
                {paymentOptions.map((option) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {renderPaymentSection()}

            <Form.Item
              label={<span className="font-medium">Deadline</span>}
              name="deadline"
              rules={[{ required: true, message: "Please set a deadline" }]}
            >
              <DatePicker placeholder="年/月/日" className="w-full h-10" />
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <span className="font-medium">Priority</span>
                  <Tooltip title="Set the priority level for this job">
                    <QuestionCircleOutlined className="text-gray-400" />
                  </Tooltip>
                </Space>
              }
              name="priority"
            >
              <Select placeholder="Select priority" className="h-10">
                {priorities.map((priority) => (
                  <Option key={priority} value={priority}>
                    {priority}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <span className="font-medium">Skill Requirements</span>
                  <Tooltip title="Required skill level for this job">
                    <QuestionCircleOutlined className="text-gray-400" />
                  </Tooltip>
                </Space>
              }
              name="skillLevel"
            >
              <Select
                placeholder="Select required skill level"
                className="h-10"
              >
                {skillLevels.map((level) => (
                  <Option key={level} value={level}>
                    {level}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={
                <span className="font-medium">Deliverable Requirements</span>
              }
              name="deliverables"
            >
              <TextArea
                placeholder="Clearly list expected deliverables, e.g., Complete source code, deployment documentation, user manual, etc."
                rows={4}
                className="resize-none"
              />
            </Form.Item>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100">
              <div className="flex items-center space-x-2 mb-6">
                <InfoCircleOutlined className="text-blue-500 text-lg" />
                <Text strong className="text-gray-800 text-base">
                  Advanced Options
                </Text>
              </div>

              <div className="space-y-5">
                <div className="flex items-center">
                  <div className="flex items-center space-x-3 w-48">
                    <Text className="font-medium text-gray-800">
                      Auto Assign
                    </Text>
                    <Tooltip title="Automatically assign to qualified agents">
                      <QuestionCircleOutlined className="text-gray-400" />
                    </Tooltip>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={autoAssign}
                      onChange={setAutoAssign}
                      style={{
                        backgroundColor: autoAssign ? "#3b82f6" : "#d1d5db",
                        borderColor: autoAssign ? "#3b82f6" : "#d1d5db",
                      }}
                    />
                    <Text type="secondary" className="text-sm">
                      Manually select Agent
                    </Text>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex items-center space-x-3 w-48">
                    <Text className="font-medium text-gray-800">
                      Allow Bidding
                    </Text>
                    <Tooltip title="Allow agents to bid on this job">
                      <QuestionCircleOutlined className="text-gray-400" />
                    </Tooltip>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={allowBidding}
                      onChange={setAllowBidding}
                      style={{
                        backgroundColor: allowBidding ? "#3b82f6" : "#d1d5db",
                        borderColor: allowBidding ? "#3b82f6" : "#d1d5db",
                      }}
                    />
                    <Text type="secondary" className="text-sm">
                      Enable bidding mode
                    </Text>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex items-center space-x-3 w-48">
                    <Text className="font-medium text-gray-800">
                      Enable Fund Escrow
                    </Text>
                    <Tooltip title="Deposit funds to escrow for security">
                      <QuestionCircleOutlined className="text-gray-400" />
                    </Tooltip>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={enableEscrow}
                      onChange={setEnableEscrow}
                      style={{
                        backgroundColor: enableEscrow ? "#3b82f6" : "#d1d5db",
                        borderColor: enableEscrow ? "#3b82f6" : "#d1d5db",
                      }}
                    />
                    <Text type="secondary" className="text-sm">
                      Deposit escrow (refunded after task completion)
                    </Text>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t">
              <Button
                size="large"
                className="px-8"
                onClick={() => form.resetFields()}
              >
                Reset
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={() => form.submit()}
                className="px-8"
                style={{
                  backgroundColor: "#1677ff",
                  borderColor: "#1677ff",
                  color: "#fff",
                }}
              >
                Create Job →
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default JobCreationForm;
