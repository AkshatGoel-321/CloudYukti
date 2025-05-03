import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import Image from 'next/image';
import teamMembers from '@/constants/team';
import { Box } from '@mui/material';

const AboutUs = () => {
  return (
    <Box p={4} className="min-h-screen py-16 flex justify-center items-center bg-gradient-to-r from-black to-gray-900">
      <Box maxWidth="md" width="100%">

        <h1 className="text-4xl font-bold mt-4 text-white text-center dark:text-white">
          CloudYukti
        </h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-white text-left dark:text-white">
            Our Vision
          </h2>
          <p className="text-gray-300">
            At VisionVigil, we envision smarter cities where AI-enhanced surveillance systems proactively ensure public safety, prevent crimes, and optimize workforce management. Our mission is to transform existing CCTV infrastructure into intelligent security networks that empower law enforcement and urban planners with real-time insights.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-white text-left dark:text-white">
            The Challenge We Address
          </h2>
          <p className="text-gray-300">
            Traditional CCTV systems offer passive monitoring with limited analytical capabilities. Our solution addresses the critical need for:
          </p>
          <ul className="list-disc list-inside mt-2 text-gray-300">
            <li>Real-time crowd behavior analysis during public events</li>
            <li>Proactive crime detection and prevention</li>
            <li>Automated workforce safety monitoring</li>
            <li>Efficient utilization of existing surveillance infrastructure</li>
            <li>Reducing response time for security incidents</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-white text-left dark:text-white">
            Our AI-Powered Solution
          </h2>
          <p className="text-gray-300">
            VisionVigil enhances existing CCTV networks with cutting-edge computer vision and machine learning capabilities:
          </p>
          <ul className="list-disc list-inside mt-4 text-gray-300">
            <li>Real-time crowd density analysis and anomaly detection</li>
            <li>Automated recognition of suspicious activities and potential threats</li>
            <li>Predictive analytics for crime hotspot identification</li>
            <li>Workplace safety compliance monitoring</li>
            <li>Integration with existing city surveillance infrastructure</li>
            <li>Multi-camera tracking and pattern recognition</li>
            <li>Customizable alerts for law enforcement agencies</li>
            <li>Privacy-preserving data processing framework</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-white text-left dark:text-white">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-md">
                <Image src={member.image} width={32} height={32} alt={member.name} className="rounded-full mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-center text-white">{member.name}</h3>
                <p className="text-gray-300 text-center mb-2">{member.role}</p>
                <div className="flex justify-center space-x-4">
                  {member.social.linkedin && (
                    <a title='linkedin' href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      <LinkedInIcon fontSize="small" />
                    </a>
                  )}
                  {member.social.github && (
                    <a title='github' href={member.social.github} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                      <GitHubIcon fontSize="small" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-white text-left dark:text-white">
            Expected Impact
          </h2>
          <ul className="list-disc list-inside mt-4 text-gray-300">
            <li>30% reduction in response time for security incidents</li>
            <li>40% improvement in crowd management efficiency</li>
            <li>25% decrease in workplace accidents through proactive monitoring</li>
            <li>60% increase in crime detection accuracy</li>
            <li>90% utilization rate of existing CCTV infrastructure</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-white text-left dark:text-white">Collaborate With Us</h2>
          <ul className="list-disc list-inside mt-4 text-gray-300">
            <li>Explore our AI models on <a href="https://github.com/exploring-solver/CloudYuktiog" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">GitHub</a></li>
            <li>Contact local law enforcement agencies to pilot our solution</li>
            <li>Partner with us for smart city implementations</li>
            <li>Request demo for your municipal corporation</li>
          </ul>
        </section>
      </Box>
    </Box>
  );
};

export default AboutUs;