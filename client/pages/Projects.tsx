import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("all");

  const projects = [
    {
      id: 1,
      title: "E-commerce Platform",
      description: "A full-stack e-commerce solution with React, Node.js, and PostgreSQL. Features include user authentication, product catalog, shopping cart, and payment integration.",
      image: "/placeholder.svg",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
      category: "web",
      github: "https://github.com",
      live: "https://example.com",
      featured: true
    },
    {
      id: 2,
      title: "Task Management App",
      description: "A collaborative task management application built with Next.js and MongoDB. Real-time updates, drag-and-drop functionality, and team collaboration features.",
      image: "/placeholder.svg",
      technologies: ["Next.js", "MongoDB", "Socket.io", "Tailwind"],
      category: "web",
      github: "https://github.com",
      live: "https://example.com",
      featured: true
    },
    {
      id: 3,
      title: "Weather API Service",
      description: "RESTful API service for weather data aggregation with caching, rate limiting, and comprehensive documentation. Built with Express and Redis.",
      image: "/placeholder.svg",
      technologies: ["Express", "Redis", "Docker", "AWS"],
      category: "api",
      github: "https://github.com",
      featured: false
    },
    {
      id: 4,
      title: "Portfolio Website",
      description: "A responsive portfolio website showcasing modern design principles, smooth animations, and optimal performance scores.",
      image: "/placeholder.svg",
      technologies: ["React", "Framer Motion", "Tailwind", "Vite"],
      category: "web",
      github: "https://github.com",
      live: "https://example.com",
      featured: false
    },
    {
      id: 5,
      title: "Data Analytics Dashboard",
      description: "Interactive dashboard for data visualization with charts, filters, and real-time updates. Built for business intelligence and reporting.",
      image: "/placeholder.svg",
      technologies: ["React", "D3.js", "Python", "FastAPI"],
      category: "web",
      github: "https://github.com",
      live: "https://example.com",
      featured: true
    },
    {
      id: 6,
      title: "Mobile App Backend",
      description: "Scalable backend infrastructure for a mobile application with user management, push notifications, and real-time messaging.",
      image: "/placeholder.svg",
      technologies: ["Node.js", "MongoDB", "Firebase", "Docker"],
      category: "mobile",
      github: "https://github.com",
      featured: false
    }
  ];

  const categories = [
    { id: "all", name: "All Projects" },
    { id: "web", name: "Web Apps" },
    { id: "mobile", name: "Mobile" },
    { id: "api", name: "APIs" }
  ];

  const filteredProjects = activeFilter === "all" 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  const featuredProjects = projects.filter(project => project.featured);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            My Projects
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A collection of projects that showcase my skills and passion for creating
            meaningful digital experiences.
          </p>
        </motion.div>

        {/* Featured Projects */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-20"
        >
          <h2 className="text-2xl font-bold mb-8">Featured Projects</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {featuredProjects.slice(0, 2).map((project, index) => (
              <Card key={project.id} className="group hover:shadow-xl transition-all duration-300">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg flex items-center justify-center border-b">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-primary">
                        {project.title.split(' ').map(word => word[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">Project Preview</p>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {project.title}
                    <Badge variant="secondary">Featured</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button size="sm" asChild>
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        Code
                      </a>
                    </Button>
                    {project.live && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={project.live} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* All Projects */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <h2 className="text-2xl font-bold mb-4 sm:mb-0">All Projects</h2>
            
            {/* Filter Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-4 w-4 text-muted-foreground" />
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeFilter === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="h-full group hover:shadow-lg transition-all duration-300">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg flex items-center justify-center border-b">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto rounded-lg bg-primary/20 flex items-center justify-center mb-2">
                        <span className="text-lg font-bold text-primary">
                          {project.title.split(' ').map(word => word[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Preview</p>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-1">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild className="flex-1">
                        <a href={project.github} target="_blank" rel="noopener noreferrer">
                          <Github className="h-3 w-3 mr-1" />
                          Code
                        </a>
                      </Button>
                      {project.live && (
                        <Button size="sm" variant="outline" asChild className="flex-1">
                          <a href={project.live} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Demo
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
