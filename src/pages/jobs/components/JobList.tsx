import React from 'react';
import { Row, Col } from 'antd';
import JobCard from './JobCard';
import { JobData } from '../types';

interface JobListProps {
  jobs: JobData[];
}

const JobList: React.FC<JobListProps> = ({ jobs }) => {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No tasks found</h3>
        <p className="text-gray-600">Try adjusting your search criteria or post a new task</p>
      </div>
    );
  }

  return (
    <Row gutter={[16, 16]}>
      {jobs.map((job) => (
        <Col key={job.id} xs={24} lg={12}>
          <JobCard job={job} />
        </Col>
      ))}
    </Row>
  );
};

export default JobList;