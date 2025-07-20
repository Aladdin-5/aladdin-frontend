// import React from "react";
// import { Row, Col, Empty } from "antd";
// import JobCard from "./JobCard";
// import { JobData } from "../types";

// interface JobListProps {
//   jobs: JobData[];
//   loading?: boolean;
// }

// const JobList: React.FC<JobListProps> = ({ jobs, loading = false }) => {
//   // 空状态处理
//   if (!loading && (!jobs || jobs.length === 0)) {
//     return (
//       <div className="text-center py-12">
//         <Empty
//           image={Empty.PRESENTED_IMAGE_SIMPLE}
//           description={
//             <div>
//               <div className="text-gray-400 text-6xl mb-4">🔍</div>
//               <h3 className="text-xl font-medium text-gray-900 mb-2">
//                 No tasks found
//               </h3>
//               <p className="text-gray-600">
//                 Try adjusting your search criteria or post a new task
//               </p>
//             </div>
//           }
//         />
//       </div>
//     );
//   }

//   return (
//     <Row gutter={[16, 16]}>
//       {jobs.map((job) => (
//         <Col key={job.id} xs={24} lg={12}>
//           <JobCard job={job} />
//         </Col>
//       ))}
//     </Row>
//   );
// };

// export default JobList;

import React from "react";
import { Row, Col, Empty } from "antd";
import JobCard from "./JobCard";
import { JobData } from "../types";

interface JobListProps {
  jobs: JobData[];
  loading?: boolean;
  onJobClick?: (job: JobData) => void; // 保持这个新增的回调
}

const JobList: React.FC<JobListProps> = ({
  jobs,
  loading = false,
  onJobClick,
}) => {
  // 空状态处理
  if (!loading && (!jobs || jobs.length === 0)) {
    return (
      <div className="text-center py-12">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div>
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No tasks found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or post a new task
              </p>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <Row gutter={[16, 16]}>
      {jobs.map((job) => (
        <Col key={job.id} xs={24} lg={12}>
          <JobCard
            job={job}
            onJobClick={onJobClick} // 传递点击回调给 JobCard
          />
        </Col>
      ))}
    </Row>
  );
};

export default JobList;
