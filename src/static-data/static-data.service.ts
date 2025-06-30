import { Injectable } from '@nestjs/common';

@Injectable()
export class StaticDataService {
  getPositions(): string[] {
    return [
      'Software Engineer',
      'Senior Software Engineer',
      'Frontend Developer',
      'Backend Developer',
      'Full Stack Developer',
      'DevOps Engineer',
      'QA Engineer',
      'Test Automation Engineer',
      'Business Analyst',
      'Product Manager',
      'Scrum Master',
      'Technical Lead',
      'Engineering Manager',
      'Solution Architect',
      'UI/UX Designer',
      'Data Scientist',
      'Data Analyst',
      'Machine Learning Engineer',
      'Cloud Engineer',
      'Site Reliability Engineer (SRE)',
      'Cybersecurity Analyst',
      'Security Engineer',
      'Database Administrator (DBA)',
      'Mobile App Developer',
      'iOS Developer',
      'Android Developer',
      'System Administrator',
      'IT Support Specialist',
      'Network Engineer',
      'Project Manager',
      'Technical Program Manager',
    ];
  }

  getDepartments(): string[] {
    return [
      'Technology',
      'Engineering',
      'Product',
      'Quality Assurance',
      'Human Resources',
      'Finance',
      'Sales',
      'Marketing',
      'Legal',
      'Customer Support',
      'Operations',
      'IT Services',
      'Research and Development',
      'Design',
      'Administration',
      'Procurement',
      'Data Analytics',
      'DevOps',
      'Cybersecurity',
      'Infrastructure',
      'Project Management',
      'Content',
      'Business Intelligence',
      'Network Engineering',
      'Training',
      'Facilities Management',
    ];
  }

  getDegrees() {
    return [
      { name: 'B.Tech in Computer Science' },
      { name: 'M.Tech in Software Engineering' },
      { name: 'MCA - Master of Computer Applications' },
      { name: 'Ph.D in Artificial Intelligence' },
      {
        name: 'B.Sc in Information Technology',
      },
      {
        name: 'B.E. in Electronics and Communication',
      },
      {
        name: 'MCA - Master of Computer Applications',
      },
      {
        name: 'MBA in Information Systems',
      },
      {
        name: 'Diploma in Computer Engineering',
      },
      {
        name: 'Ph.D in Artificial Intelligence',
      },
    ];
  }

  getUniversities() {
    return [
      {
        name: 'Indian Institute of Technology (IIT)',
      },
      {
        name: 'National Institute of Technology (NIT)',
      },
      { name: 'Delhi University' },
      {
        name: 'Birla Institute of Technology and Science (BITS)',
      },
      { name: 'Anna University' },
      { name: 'Jadavpur University' },
      { name: 'VIT University' },
      { name: 'University of Pune' },
      { name: 'Banaras Hindu University' },
      { name: 'Amity University' },
      {
        name: 'Lovely Professional University',
      },
      {
        name: 'Indira Gandhi National Open University',
      },
      { name: 'IIT Bombay' },
      { name: 'IIT Delhi' },
      { name: 'IIT Madras' },
      { name: 'IIT Kanpur' },
      { name: 'IIT Kharagpur' },
      { name: 'IIT Roorkee' },
      { name: 'IIT Guwahati' },
      { name: 'IIT Hyderabad' },
      { name: 'IISc Bangalore' },
      { name: 'NIT Trichy' },
      { name: 'NIT Karnataka' },
      { name: 'Delhi University' },
      {
        name: 'Jawaharlal Nehru University',
      },
      { name: 'Banaras Hindu University' },
      { name: 'Jadavpur University' },
      {
        name: 'Amrita Vishwa Vidyapeetham',
      },
      { name: 'Aligarh Muslim University' },
      {
        name: 'Manipal Academy of Higher Education',
      },
      {
        name: 'Vellore Institute of Technology',
      },
      { name: 'University of Mysore' },
      { name: 'University of Calcutta' },
      { name: 'Osmania University' },
      { name: 'Anna University' },
      {
        name: 'Coimbatore University of Science & Technology',
      },
      { name: 'Kerala University' },
      { name: 'Lucknow University' },
      { name: 'Punjab University' },
      { name: 'Amity University, Noida' },
      { name: 'Shiv Nadar University' },
      { name: 'Ashoka University' },
      { name: 'Manipal University' },
      { name: 'Gl bodi University' },
      { name: 'Jamia Millia Islamia' },
      {
        name: 'Lovely Professional University',
      },
      {
        name: 'National Law School of India University',
      },
      { name: 'Xavier University' },
      { name: 'IIM Ahmedabad' },
      { name: 'IGNOU' },
      {
        name: 'SRM Institute of Science and Technology',
      },
      {
        name: 'Central University of Rajasthan',
      },
      {
        name: 'Central University of Karnataka',
      },
      {
        name: 'Central University of Gujarat',
      },
      {
        name: 'Dr B R Ambedkar University, Delhi',
      },
      {
        name: 'Manipal Institute of Technology',
      },
      { name: 'BITS Pilani' },
      { name: 'Caltech IIT Jammu' },
      { name: 'IIT Bhubaneswar' },
      { name: 'IIT Patna' },
      { name: 'IIT Mandi' },
      { name: 'IIT Indore' },
      { name: 'IIT Ropar' },
      { name: 'IGNOU' },
      {
        name: 'Birla Institute of Technology & Science – Pilani',
      },
      {
        name: 'National Institute of Fashion Technology, Delhi',
      },
      {
        name: 'National Institute of Mental Health & Neuro Sciences',
      },
      {
        name: 'National Institute of Design, Ahmedabad',
      },
    ];
  }

  getManagers() {
    return [
      {
        name: 'Rahul Verma',
        position: 'Engineering Manager',
        project: 'Notes Management System',
        image: 'https://randomuser.me/api/portraits/men/10.jpg',
      },
      {
        name: 'Anjali Mehta',
        position: 'Product Manager',
        project: 'Compliance Dashboard',
        image: 'https://randomuser.me/api/portraits/women/11.jpg',
      },
      {
        name: 'Rahul Verma',
        position: 'Engineering Manager',
        project: 'Notes Management System',
        image: 'https://randomuser.me/api/portraits/men/10.jpg',
      },
      {
        name: 'Anjali Mehta',
        position: 'Product Manager',
        project: 'Compliance Dashboard',
        image: 'https://randomuser.me/api/portraits/women/11.jpg',
      },
      {
        name: 'Karan Singh',
        position: 'Tech Lead',
        project: 'Billing Engine',
        image: 'https://randomuser.me/api/portraits/men/12.jpg',
      },
      {
        name: 'Neha Sharma',
        position: 'QA Lead',
        project: 'Test Automation Suite',
        image: 'https://randomuser.me/api/portraits/women/13.jpg',
      },
      {
        name: 'Amit Desai',
        position: 'Sr. Software Engineer',
        project: 'User Portal',
        image: 'https://randomuser.me/api/portraits/men/14.jpg',
      },
    ];
  }
}
