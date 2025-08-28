import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  HelpCircle, 
  BookOpen, 
  MessageSquare, 
  Mail, 
  Youtube, 
  FileText, 
  Video, 
  Search,
  ChevronRight,
  Lightbulb,
  Users,
  Settings,
  Shield
} from 'lucide-react';

const HelpPage = () => {
  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Learn the basics of Eco-Auto Productivity Suite',
      icon: BookOpen,
      articles: [
        { title: 'Quick Start Guide', readingTime: '5 min' },
        { title: 'Navigating the Dashboard', readingTime: '3 min' },
        { title: 'Understanding Responsibilities', readingTime: '7 min' }
      ]
    },
    {
      id: 'roadmaps',
      title: 'Roadmaps & Stages',
      description: 'Master the game-like roadmap system',
      icon: Settings,
      articles: [
        { title: 'Creating New Roadmaps', readingTime: '8 min' },
        { title: 'Managing Stages', readingTime: '6 min' },
        { title: 'Auto-Assignment Explained', readingTime: '10 min' }
      ]
    },
    {
      id: 'tasks',
      title: 'Tasks & Assignments',
      description: 'Work with tasks and responsibilities',
      icon: CheckCircle,
      articles: [
        { title: 'Task Creation Workflow', readingTime: '6 min' },
        { title: 'Collaborating on Tasks', readingTime: '4 min' },
        { title: 'Tracking Progress', readingTime: '5 min' }
      ]
    },
    {
      id: 'team',
      title: 'Team Management',
      description: 'Manage your team and responsibilities',
      icon: Users,
      articles: [
        { title: 'Adding Team Members', readingTime: '4 min' },
        { title: 'Setting Responsibilities', readingTime: '7 min' },
        { title: 'Capacity Planning', readingTime: '9 min' }
      ]
    }
  ];

  const faqs = [
    {
      question: 'How does the auto-assignment system work?',
      answer: 'The auto-assignment system matches tasks to team members based on their responsibilities, sub-responsibilities, skill levels, and current capacity. It ensures balanced workload distribution and escalates to managers when needed.'
    },
    {
      question: 'What are the different stage statuses?',
      answer: 'Stages can be LOCKED (not yet available), READY (available for work), IN_PROGRESS (being worked on), REVIEW (awaiting approval), DONE (completed), or BLOCKED (has issues preventing progress).'
    },
    {
      question: 'How do I create a new project?',
      answer: 'Navigate to the Projects section, click "New Project", fill in the details, and create an associated roadmap. The system will guide you through setting up stages and responsibilities.'
    },
    {
      question: 'Can I customize the roadmap visualization?',
      answer: 'Yes, you can switch between board view and list view, filter by status, and customize which information is displayed for each stage in the roadmap.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-green to-accent-blue rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <HelpCircle className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Help Center</h1>
            <p className="text-white/90 mt-1">Find answers, watch tutorials, and get support</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
        <CardContent className="p-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search help articles..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-primary-green text-base shadow-sm hover:shadow-md transition-shadow"
            />
          </div>
        </CardContent>
      </Card>

      {/* Help Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {helpCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Card 
              key={category.id} 
              className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-green/10 rounded-lg">
                    <Icon className="w-6 h-6 text-primary-green" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{category.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.articles.map((article, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                    >
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{article.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{article.readingTime} read</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center p-6 h-auto rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
        >
          <Video className="w-8 h-8 text-primary-green mb-2" />
          <span className="font-medium">Video Tutorials</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center p-6 h-auto rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
        >
          <FileText className="w-8 h-8 text-primary-green mb-2" />
          <span className="font-medium">Documentation</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center p-6 h-auto rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
        >
          <MessageSquare className="w-8 h-8 text-primary-green mb-2" />
          <span className="font-medium">Community Forum</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center p-6 h-auto rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
        >
          <Mail className="w-8 h-8 text-primary-green mb-2" />
          <span className="font-medium">Contact Support</span>
        </Button>
      </div>

      {/* FAQ Section */}
      <Card className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpPage;