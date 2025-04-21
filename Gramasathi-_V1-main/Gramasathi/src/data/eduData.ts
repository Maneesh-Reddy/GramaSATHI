export interface EducationalResource {
  id: string;
  title: string;
  description: string;
  category: string; // 'children', 'women', or 'youth'
  image: string;
  link?: string;
}

export const getEducationalResources = (): EducationalResource[] => {
  return [
    // Children Resources
    {
      id: 'edu1',
      title: 'Basic Literacy Skills',
      description: 'Interactive lessons for children to learn reading and writing in their native language.',
      category: 'children',
      image: 'https://images.pexels.com/photos/256468/pexels-photo-256468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/literacy-skills',
    },
    {
      id: 'edu2',
      title: 'Mathematics Fun',
      description: 'Fun activities and games to help children learn basic mathematics concepts.',
      category: 'children',
      image: 'https://images.pexels.com/photos/167682/pexels-photo-167682.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/math-fun',
    },
    {
      id: 'edu3',
      title: 'Science for Kids',
      description: 'Simple science experiments and explanations for young curious minds.',
      category: 'children',
      image: 'https://images.pexels.com/photos/2280551/pexels-photo-2280551.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/kids-science',
    },
    
    // Women Resources
    {
      id: 'edu4',
      title: 'Women\'s Health Education',
      description: 'Educational material about women\'s health, hygiene, and nutrition.',
      category: 'women',
      image: 'https://images.pexels.com/photos/6551144/pexels-photo-6551144.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/womens-health-education',
    },
    {
      id: 'edu5',
      title: 'Financial Literacy for Women',
      description: 'Resources to help women understand savings, banking, and financial independence.',
      category: 'women',
      image: 'https://media.licdn.com/dms/image/v2/D4D12AQEucCqlsDAEZw/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1688479669124?e=2147483647&v=beta&t=iGGXqQ8GnFWrx3rDsicaxsHb8htpj9F8h0kJV1KcWiw',
      link: 'https://example.com/women-financial-literacy',
    },
    {
      id: 'edu6',
      title: 'Skill Development Courses',
      description: 'Courses for developing various skills like tailoring, cooking, handicrafts, etc.',
      category: 'women',
      image: 'https://cache.careers360.mobi/media/article_images/2021/8/10/skill-development-courses-after-10th.jpg',
      link: 'https://example.com/women-skill-development',
    },
    
    // Youth Resources
    {
      id: 'edu7',
      title: 'Digital Skills Training',
      description: 'Training modules for basic computer and internet usage.',
      category: 'youth',
      image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/digital-skills',
    },
    {
      id: 'edu8',
      title: 'Career Guidance',
      description: 'Resources to help youth understand various career options and how to pursue them.',
      category: 'youth',
      image: 'https://images.pexels.com/photos/7516347/pexels-photo-7516347.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/career-guidance',
    },
    {
      id: 'edu9',
      title: 'Entrepreneurship Basics',
      description: 'Introduction to entrepreneurship and starting small businesses.',
      category: 'youth',
      image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/entrepreneurship',
    },
  ];
};