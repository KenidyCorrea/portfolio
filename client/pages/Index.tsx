import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, Github, Linkedin, Mail, Download, Calendar, MapPin,
  GraduationCap, Briefcase, Star, ExternalLink, Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";

export default function Index() {
  const [activeFilter, setActiveFilter] = useState("all");
  const { toast } = useToast();
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);

  const handleDownloadCV = (language: string) => {
    setShowLanguageOptions(false);

    const cvPaths = {
      portugues: "/cv_kenidy_pt.pdf",
      ingles: "/cv_kenidy_eng.pdf"
    };

    const link = document.createElement("a");
    link.href = cvPaths[language as keyof typeof cvPaths];
    link.download = `Kenidy-Correa-CV-${language}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download iniciado!",
      description: `Currículo em ${language === 'portugues' ? 'português' : 'inglês'} está sendo baixado.`,
    });
  };

  const techStack = [
    "React", "TypeScript", "Node.js", "PostgreSQL",
    "Tailwind CSS", "Next.js", "Express", "MongoDB"
  ];

  const timelineItems = [
    {
      type: "work",
      title: "Desenvolvedor Full Stack",
      company: "Grupo Santa Casa de Franca",
      period: "2025 - Presente",
      description: "Liderando o desenvolvimento de APIs, aplicações web e mobile usando tecnologias como React, PostgreSQL, React Native, NestJs, etc.",
      icon: <Briefcase className="h-4 w-4" />
    },
    {
      type: "education",
      title: "Bacharelado em Tecnologia da Informação",
      company: "Universidade Virtual do Estado de São Paulo",
      period: "2024 - 2027",
      description: "Foco em engenharia de software, algoritmos e sistemas de banco de dados.",
      icon: <GraduationCap className="h-4 w-4" />
    },
    {
      type: "work",
      title: "Desenvolvedor Junior",
      company: "Lev Negócios",
      period: "2024 - 2025",
      description: "Desenvolvendo aplicações web usando React, criando RPAs Typescript e consumo de APIs.",
      icon: <Briefcase className="h-4 w-4" />
    },
    {
      type: "work",
      title: "Analista de Mineração de dados",
      company: "Lev Negócios",
      period: "2023 - 2024",
      description: "Criando e mantendo RPAs Python para WebScraping e ETL.",
      icon: <Briefcase className="h-4 w-4" />
    },
  ];

  const technologies = [
    { name: "React", level: 78, category: "Frontend" },
    { name: "TypeScript", level: 75, category: "Linguagem" },
    { name: "Node.js", level: 85, category: "Backend" },
    { name: "PostgreSQL", level: 90, category: "Banco de Dados" },
    { name: "Material UI", level: 90, category: "Estilização" },
    { name: "Next.js", level: 87, category: "Framework" },
    { name: "Express", level: 92, category: "Backend" },
    { name: "NestJS", level: 80, category: "Framework" },
  ];

  const projects = [
    {
      id: 1,
      title: "Conecta Santa Casa",
      description: "Aplicativo mobile para pacientes oncólogicos realizarem a gestão do tratamento com acompanhamento de agenda, conteúdos e registros de sintomas, além de chat para comunicação com a Equipe Hospitalar.",
      technologies: ["Expo", "PostgreSQL", "Typescript", "socket.IO"],
      category: "mobile",
      image: "app-paciente.png",
      live: "",
      featured: true
    },
    {
      id: 2,
      title: "Balança Smart",
      description: "Solução IoT para monitoramento inteligente de peso. A aplicação orienta uma sessão de pesagem com interações com o paciente, monitora o peso registra na balança e registra no EMR Hospitalar Tasy.",
      technologies: ["HTML", "Javascript", "serialport", "Electron"],
      category: "desktop",
      image: "balanca-smart.png",
      live: 'https://www.linkedin.com/feed/update/urn:li:activity:7348101545009283072/',
      featured: true
    },
    {
      id: 3,
      title: "ChatBot Agendamento",
      description: "Integração entre o sistema de chatbot para WhatsApp ChatGuru e o sistema hospitalar Tasy. O Objetivo foi realizar agendamentos de consultas automaticamente direto com o paciente, registrando diretamente no EMR.",
      technologies: ["Next.js", "Node.js", "PostgreSQL", "RabbitMQ"],
      category: "api",
      image: 'chatbot.png',
      live: "https://wa.me/5516996807670",
      featured: true
    },
    {
      id: 4,
      title: "Site Portfolio",
      description: "Um site portfolio responsivo demonstrando princípios de design moderno, animações suaves e pontuações ótimas de performance.",
      technologies: ["React", "Framer Motion", "Tailwind", "Vite"],
      category: "web",
      github: "https://github.com/KenidyCorrea/portfolio",
      live: "https://portfolio-6m0a.onrender.com/",
      image: 'portfolio.png',
      featured: false
    },
    {
      id: 5,
      title: "Dashboard de Análise de Dados",
      description: "Dashboard interativo para visualização de dados com gráficos, filtros e atualizações em tempo real. Criado para acompanhamento de alta hospitalar e ocupação de leitos.",
      technologies: ["React", "Tailwind", "NestJS", "Next.js"],
      category: "web",
      image: 'cma.png',
      featured: true
    },
    {
      id: 6,
      title: "Convite de Casamento",
      description: "Convite digital do meu casamento, com dados sobre local e forma de presentear.",
      technologies: ["Vite", "Tailwind", "TypeScript"],
      category: "web",
      github: "https://github.com/KenidyCorrea/casamento",
      live: "https://biaekenidy.com/",
      image: 'casamento.png',
      featured: true
    },
  ];

  const categories = [
    { id: "all", name: "Todos os Projetos" },
    { id: "web", name: "Web Apps" },
    { id: "mobile", name: "Mobile" },
    { id: "desktop", name: "Desktop" },
    { id: "api", name: "APIs" }
  ];

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      label: "Email",
      value: "kenidycorrea37@gmail.com",
      href: "mailto:kenidycorrea37@gmail.com"
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: "Localização",
      value: "Franca, SP",
      href: null
    }
  ];

  const socialLinks = [
    {
      name: "GitHub",
      icon: <Github className="h-5 w-5" />,
      href: "https://github.com/KenidyCorrea",
      username: "@kenidycorrea"
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-5 w-5" />,
      href: "https://www.linkedin.com/in/kenidy-correa-3a7a14259/",
      username: "Kenidy Corrêa"
    }
  ];

  const filteredProjects = activeFilter === "all"
    ? projects
    : projects.filter(project => project.category === activeFilter);

  const featuredProjects = projects.filter(project => project.featured);

  return (
    <Layout>
      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,theme(colors.primary/0.1),transparent_70%)]" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="max-w-15xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            {/* Profile Image */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="relative inline-block">
                {/* Foto de perfil */}
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary to-primary/60 p-1">
                  <img
                    src="profile.jpeg" // caminho da sua imagem
                    alt="Foto de perfil"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                {/* Anel girando */}
                <motion.div
                  className="absolute -inset-6 rounded-full border-4 border-primary/40"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </motion.div>


            {/* Name and Title */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                Kenidy Corrêa
              </h1>
              <div className="text-xl sm:text-2xl text-muted-foreground mb-2">
                Desenvolvedor Full Stack
              </div>
              <div className="flex flex-wrap justify-center gap-2 text-sm text-primary font-medium">
                {techStack.slice(0, 4).map((tech, index) => (
                  <span key={tech} className="flex items-center">
                    {tech}
                    {index < 3 && <span className="ml-2 text-muted-foreground">•</span>}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Impact Statement */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              Transformando ideias inovadoras em{" "}
              <span className="text-primary font-semibold">soluções digitais escaláveis</span>{" "}
              que entregam valor real. Desenvolvo aplicações web modernas com código limpo,
              design cuidadoso e performance que importa.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <a href="#projects">
                <Button size="lg" className="group">
                  Ver Meus Projetos
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </a>
              <a href="#contact">
                <Button variant="outline" size="lg" className="group">
                  Entre em Contato
                  <Mail className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="lg"
                  className="group"
                  onClick={() => setShowLanguageOptions(!showLanguageOptions)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Currículo
                </Button>

                {showLanguageOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-background border rounded-md shadow-lg z-10"
                  >
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-muted transition-colors"
                      onClick={() => handleDownloadCV('portugues')}
                    >
                      Português
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-muted transition-colors"
                      onClick={() => handleDownloadCV('ingles')}
                    >
                      English
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex justify-center space-x-6"
            >
              <a
                href="https://github.com/KenidyCorrea"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/kenidy-correa-3a7a14259/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href="mailto:kenidycorrea37@gmail.com"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <Mail className="h-6 w-6" />
              </a>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <a href="#about">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center cursor-pointer hover:border-primary/50 transition-colors"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-3 bg-primary/60 rounded-full mt-2"
              />
            </motion.div>
          </a>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Sobre Mim
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Desenvolvedor quase 2 anos de experiência criando soluções digitais
              que fazem a diferença. Adoro transformar problemas complexos em designs simples e bonitos.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            {/* Personal Story */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    Minha Jornada
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    Comecei minha jornada em um estágio na área operacional, onde percebi muitas oportunidades de automação que facilitariam a vida dos colaboradores
                    e agregaria valor a operação da empresa. Foi o que me despertou interesse na programação. Percebi que linhas de código
                    poderiam criar experiências interativas. O que começou como curiosidade rapidamente
                    se tornou uma paixão por criar soluções digitais.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Hoje, me especializo em desenvolvimento full-stack. Acredito em escrever código limpo e sustentável
                    e criar experiências de usuário que sejam intuitivas e encantadoras.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Franca, SP</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Photo Placeholder */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="w-80 h-80 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-border">
                  <div className="text-center">
                    <div className="w-80 h-80 mx-auto rounded-full bg-primary/20 flex items-center justify-center ">
                      <img
                        src="comercial.jpg"
                        alt="Foto de perfil"
                        className="w-full h-full object-cover rounded-[12px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Timeline */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h3 className="text-3xl font-bold text-center mb-12">Experiência & Educação</h3>
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
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-center mb-12">Tecnologias & Habilidades</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {technologies.map((tech) => (
                <Card key={tech.name} className="group hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{tech.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {tech.category}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Proficiência</span>
                        <span className="font-medium">{tech.level}%</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${tech.level}%` }}
                          transition={{ duration: 1, delay: 0.5 + (technologies.indexOf(tech) * 0.1) }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Meus Projetos
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Uma coleção de projetos que demonstram minhas habilidades e paixão por criar
              experiências digitais significativas.
            </p>
          </motion.div>

          {/* Featured Projects */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h3 className="text-2xl font-bold mb-8">Projetos em Destaque</h3>
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredProjects.slice(0, 2).map((project, index) => (
                <Card key={project.id} className="group hover:shadow-xl transition-all duration-300">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg flex items-center justify-center border-b">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                          <span className="text-2xl font-bold text-primary">
                            {project.title.split(' ').map(word => word[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">Preview do Projeto</p>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {project.title}
                      <Badge variant="secondary">Destaque</Badge>
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
                        {project.github ? <a href={project.github} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-2" />
                          Código
                        </a> : <a>
                          <Github className="h-4 w-4 mr-2" />
                          Repositório Privado
                        </a>}
                      </Button>
                      {project.live && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={project.live} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Demo
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
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <h3 className="text-2xl font-bold mb-4 sm:mb-0">Todos os Projetos</h3>

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
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full group hover:shadow-lg transition-all duration-300">
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg flex items-center justify-center border-b">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                            <span className="text-2xl font-bold text-primary">
                              {project.title.split(' ').map(word => word[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">Preview do Projeto</p>
                        </div>
                      )}
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
                          {project.github ? <a href={project.github} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4 mr-2" />
                            Código
                          </a> : <a>
                            <Github className="h-4 w-4 mr-2" />
                            Repositório Privado
                          </a>}
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
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Entre em Contato
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tem um projeto em mente ou quer discutir oportunidades?
              Adoraria ouvir de você. Vamos criar algo incrível juntos.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="font-medium">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {/* Social Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Conecte-se comigo</CardTitle>
                </CardHeader>
                <CardContent className="">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-1 rounded-lg hover:bg-muted transition-colors group"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {link.icon}
                      </div>
                      <div>
                        <p className="font-medium">{link.name}</p>
                        <p className="text-sm text-muted-foreground">{link.username}</p>
                      </div>
                    </a>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
