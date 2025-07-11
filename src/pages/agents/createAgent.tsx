import React, { useState } from 'react';
import {
    Form,
    Input,
    Select,
    Switch,
    Button,
    Card,
    Alert,
    Typography,
    Space,
    Tooltip,
    Tag,
    message
} from 'antd';
import { ArrowLeftOutlined, QuestionCircleOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import agentApi from '@/api/agentApi'
const { Title, Paragraph, Text } = Typography;
import { useNavigate} from 'react-router-dom';
const { TextArea } = Input;
const { Option } = Select;

import { AgentFormData } from '@/types/agents/index';

const AgentCreatePage: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm<AgentFormData>();
    const [loading, setLoading] = useState<boolean>(false);
    const [inputTagValue, setInputTagValue] = useState<string>('');
    const [tags, setTags] = useState<string[]>([]);

    const handleAddTag = (): void => {
        if (inputTagValue.trim() && !tags.includes(inputTagValue.trim())) {
            const newTags = [...tags, inputTagValue.trim()];
            setTags(newTags);
            form.setFieldsValue({ tags: newTags });
            setInputTagValue('');
        } else if (tags.includes(inputTagValue.trim())) {
            message.warning('Tag already exists');
        }
    };

    const handleRemoveTag = (tagToRemove: string): void => {
        const newTags = tags.filter(tag => tag !== tagToRemove);
        setTags(newTags);
        form.setFieldsValue({ tags: newTags });
    };

    const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleSubmit = async (values: AgentFormData): Promise<void> => {
        setLoading(true);
        try {
            const submitData = {
                agentName: values.agentName,
                agentAddress: values.agentAddress,
                description: values.description,
                authorBio: values.authorBio, 
                agentClassification: values.agentClassification,
                tags: values.tags || [],
                walletAddress: values.walletAddress,
                autoAcceptJobs: Boolean(values.autoAcceptJobs),
                // 新增必填字段
                // isPrivate: !values.isFree, // 将 isFree 转换为 isPrivate（免费=非私有）
                // contractType: 'result', // 默认值
                // isActive: true // 默认激活
            };
            await agentApi.addAgent(submitData)
            console.log('Form submitted:', submitData);
            //重置清空
            handleReset()
            navigate('/agent')
        } catch (error) {
            console.error('Error deploying agent:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = (): void => {
        window.history.back();
    };

    const handleReset = (): void => {
        form.resetFields();
        setTags([]);
        setInputTagValue('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={handleBack}
                        className="flex items-center"
                    >
                        Back
                    </Button>
                </div>

                {/* Title */}
                <div className="text-center mb-8">
                    <Title level={2} className="mb-4">Deploy Agent Based on Aladdin Protocol</Title>

                    {/* Protocol Information Cards */}
                    <div className="mb-6 space-y-3">
                        <Alert
                            message="Agent payment is result-oriented, meaning payment is based on the Agent's execution results. Funds are temporarily held in escrow by the open-source Aladdin Protocol contract."
                            type="info"
                            showIcon
                            className="text-left"
                        />
                        <Alert
                            message="The settlement process is automatically completed using a third-party verification system. In case of disputes, the DAO committee will make the final decision."
                            type="info"
                            showIcon
                            className="text-left"
                        />
                        <Alert
                            message="Before settlement, the Agent's funds are held in escrow by the contract and can earn additional stablecoin staking rewards."
                            type="info"
                            showIcon
                            className="text-left"
                        />
                    </div>
                </div>

                {/* Form */}
                <Card className="shadow-lg">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{
                            autoAcceptJobs: false,
                            isFree: false,
                            agentClassification: undefined,
                            tags: []
                        }}
                    >
                        {/* Agent Name */}
                        <Form.Item
                            name="agentName"
                            label={
                                <Space>
                                    Agent Name
                                    <Tooltip title="Enter a unique name for your agent">
                                        <QuestionCircleOutlined />
                                    </Tooltip>
                                </Space>
                            }
                            rules={[{ required: true, message: 'Please enter agent name' }]}
                        >
                            <Input placeholder="Enter Agent name" size="large" />
                        </Form.Item>

                        {/* Tags */}
                        <Form.Item
                            name="tags"
                            label={
                                <Space>
                                    Tags
                                    <Tooltip title="Enter tags and press Enter to add, e.g., data analysis, automation, AI assistant">
                                        <QuestionCircleOutlined />
                                    </Tooltip>
                                </Space>
                            }
                        >
                            <div>
                                {/* Display Tags */}
                                {tags.length > 0 && (
                                    <div className="mb-2 flex flex-wrap gap-2">
                                        {tags.map((tag, index) => (
                                            <Tag
                                                key={index}
                                                closable
                                                onClose={() => handleRemoveTag(tag)}
                                                closeIcon={<CloseOutlined />}
                                                color="blue"
                                            >
                                                {tag}
                                            </Tag>
                                        ))}
                                    </div>
                                )}

                                {/* Input for adding tags */}
                                <Input
                                    placeholder="Enter tag name and press Enter or click the add button"
                                    size="large"
                                    value={inputTagValue}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputTagValue(e.target.value)}
                                    onKeyPress={handleInputKeyPress}
                                    suffix={
                                        <Button
                                            type="text"
                                            icon={<PlusOutlined />}
                                            onClick={handleAddTag}
                                            disabled={!inputTagValue.trim()}
                                        />
                                    }
                                />
                            </div>
                        </Form.Item>

                        {/* Auto Accept Jobs */}
                        <Form.Item
                            name="autoAcceptJobs"
                            label={
                                <Space>
                                    Auto Accept Jobs
                                    <Tooltip title="Automatically accept jobs that match your agent's capabilities">
                                        <QuestionCircleOutlined />
                                    </Tooltip>
                                </Space>
                            }
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>

                        {/* Agent Classification */}
                        <Form.Item
                            name="agentClassification"
                            label={
                                <Space>
                                    Agent Classification
                                    <Tooltip title="Select the category that best describes your agent">
                                        <QuestionCircleOutlined />
                                    </Tooltip>
                                </Space>
                            }
                            rules={[{ required: true, message: 'Please select agent classification' }]}
                        >
                            <Select placeholder="Select Agent classification" size="large">
                                <Option value="personal-assistant">Personal Assistant</Option>
                                <Option value="visual-designer">Visual Designer</Option>
                                <Option value="marketing-expert">Marketing Expert</Option>
                                <Option value="biotech-analyst">Biotech Analyst</Option>
                                <Option value="financial-analyst">Financial Analyst</Option>
                                <Option value="mathematician">Mathematician</Option>
                                <Option value="prediction-market-analyst">Prediction Market Analyst</Option>
                                <Option value="software">Software</Option>
                            </Select>
                        </Form.Item>

                        {/* Agent Address */}
                        <Form.Item
                            name="agentAddress"
                            label={
                                <Space>
                                    Agent Address
                                    <Tooltip title="Enter Agent address (e.g., https://api.example.com)">
                                        <QuestionCircleOutlined />
                                    </Tooltip>
                                </Space>
                            }
                            rules={[{ required: true, message: 'Please enter agent address' }]}
                        >
                            <Input
                                placeholder="Enter Agent address (e.g., https://api.example.com)"
                                size="large"
                                addonAfter={
                                    <Button type="link" size="small" className="p-0">
                                        View API Call Example
                                    </Button>
                                }
                            />
                        </Form.Item>

                        {/* 钱包地址 */}
                        <Form.Item
                            name="walletAddress"
                            label={
                                <Space>
                                    Wallet Address
                                    <Tooltip title="Enter a unique name for your agent">
                                        <QuestionCircleOutlined />
                                    </Tooltip>
                                </Space>
                            }
                            rules={[{ required: true, message: 'Please enter wallet address' }]}
                        >
                            <Input placeholder="Enter Wallet Address" size="large" />
                        </Form.Item>

                        {/* Brief Description */}
                        <Form.Item
                            name="description"
                            label={
                                <Space>
                                    Brief Description
                                    <Tooltip title="Briefly describe the functionality of this Agent">
                                        <QuestionCircleOutlined />
                                    </Tooltip>
                                </Space>
                            }
                            rules={[{ required: true, message: 'Please enter a brief description' }]}
                        >
                            <TextArea
                                placeholder="Briefly describe the functionality of this Agent"
                                rows={4}
                                maxLength={500}
                                showCount
                            />
                        </Form.Item>

                        {/* Author Bio */}
                        <Form.Item
                            name="authorBio"
                            label={
                                <Space>
                                    Author Bio
                                    <Tooltip title="Introduce your professional background, skills, or team experience, e.g., 7 years of AI development experience, specializing in natural language processing">
                                        <QuestionCircleOutlined />
                                    </Tooltip>
                                </Space>
                            }
                            rules={[{ required: true, message: 'Please enter authorBio' }]}
                        >
                            <TextArea
                                placeholder="Introduce your professional background, skills, or team experience, e.g., 7 years of AI development experience, specializing in natural language processing"
                                rows={3}
                                maxLength={300}
                                showCount
                            />
                        </Form.Item>

                        {/* Is Free */}
                        <Form.Item
                            name="isFree"
                            label={
                                <Space>
                                    Is Free
                                    <Tooltip title="Make this agent free for all users">
                                        <QuestionCircleOutlined />
                                    </Tooltip>
                                </Space>
                            }
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>

                        {/* Action Buttons */}
                        <Form.Item className="mb-0 mt-6">
                            <Space className="w-full justify-between">
                                <Button size="large" onClick={handleReset}>
                                    Reset
                                </Button>
                                <Button
                                    htmlType="submit"
                                    size="large"
                                    loading={loading}
                                    className="px-8"
                                >
                                    Deploy →
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default AgentCreatePage;