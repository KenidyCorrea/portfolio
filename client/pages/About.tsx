import { motion } from "framer-motion";
import { Calendar, MapPin, Code, GraduationCap, Briefcase, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";

export default function About() {
  const timelineItems = [
    {
      type: "work",
      title: "Senior Full Stack Developer",
      company: "Tech Solutions Inc.",
      period: "2022 - Present",
      description: "Leading development of scalable web applications using React, Node.js, and PostgreSQL.",
      icon: <Briefcase className="h-4 w-4" />
    },
    {
      type: "work",
      title: "Frontend Developer",
      company: "Digital Agency Co.",
      period: "2020 - 2022",
      description: "Built responsive websites and web applications using React and modern CSS frameworks.",
      icon: <Briefcase className="h-4 w-4" />
    },
    {
      type: "education",
      title: "Bachelor of Computer Science",
      company: "State University",
      period: "2016 - 2020",
      description: "Focused on software engineering, algorithms, and database systems.",
      icon: <GraduationCap className="h-4 w-4" />
    }
  ];

  const technologies = [
    { name: "React", level: 95, category: "Frontend" },
    { name: "TypeScript", level: 90, category: "Language" },
    { name: "Node.js", level: 85, category: "Backend" },
    { name: "PostgreSQL", level: 80, category: "Database" },
    { name: "Tailwind CSS", level: 95, category: "Styling" },
    { name: "Next.js", level: 88, category: "Framework" },
    { name: "Express", level: 82, category: "Backend" },
    { name: "MongoDB", level: 75, category: "Database" }
  ];

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
            About Me
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Passionate developer with 4+ years of experience creating digital solutions
            that make a difference. I love turning complex problems into simple, beautiful designs.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Personal Story */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  My Journey
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  I started my coding journey in college, fascinated by how lines of code
                  could create interactive experiences. What began as curiosity quickly
                  became a passion for crafting digital solutions.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Today, I specialize in full-stack development, with a particular love
                  for React and Node.js. I believe in writing clean, maintainable code
                  and creating user experiences that feel intuitive and delightful.
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>San Francisco, CA</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Photo Placeholder */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="w-80 h-80 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-border">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <Code className="h-12 w-12 text-primary" />
                  </div>
                  <p className="text-muted-foreground">Professional Photo</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Experience & Education</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-border" />
            <div className="space-y-8">
              {timelineItems.map((item, index) => (
                <div key={index} className="relative">
                  <div className={`flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    <div className={`w-full lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8'}`}>
                      <Card>
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            {item.icon}
                            <CardTitle className="text-lg">{item.title}</CardTitle>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="font-medium">{item.company}</span>
                            <span>•</span>
                            <Calendar className="h-3 w-3" />
                            <span>{item.period}</span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{item.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Technologies */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">Technologies & Skills</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {technologies.map((tech) => (
              <Card key={tech.name} className="group hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{tech.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {tech.category}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Proficiency</span>
                      <span className="font-medium">{tech.level}%</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${tech.level}%` }}
                        transition={{ duration: 1, delay: 0.8 + (technologies.indexOf(tech) * 0.1) }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
