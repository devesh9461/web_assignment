/**
 * HeatGuard AI — Computer Heating Prevention Solution
 * Main JavaScript: Particle system, 3D interactions, AI diagnostics engine,
 * scroll animations, dashboard simulation, and navigation logic.
 */

// ===== PRELOADER =====
window.addEventListener('load', () => {
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    setTimeout(() => preloader.classList.add('hidden'), 800);
  }
});

// ===== PARTICLE SYSTEM =====
class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    const count = Math.min(80, Math.floor((this.canvas.width * this.canvas.height) / 15000));
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        hue: Math.random() > 0.5 ? 187 : 230 // cyan or blue
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createParticles();
    });
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((p, i) => {
      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap around
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.opacity})`;
      this.ctx.fill();

      // Draw connections
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `hsla(187, 100%, 50%, ${0.08 * (1 - dist / 150)})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    });

    requestAnimationFrame(() => this.animate());
  }
}

// ===== NAVBAR =====
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const overlay = document.querySelector('.nav-overlay');
  const links = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      if (overlay) overlay.classList.toggle('active');
    });
  }

  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('active');
      navLinks?.classList.remove('open');
      overlay?.classList.remove('active');
    });
  });

  if (overlay) {
    overlay.addEventListener('click', () => {
      hamburger?.classList.remove('active');
      navLinks?.classList.remove('open');
      overlay.classList.remove('active');
    });
  }
}

// ===== SCROLL PROGRESS =====
function initScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
  });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll, .solution-step');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Animate effectiveness bars
        const effBar = entry.target.querySelector('.effectiveness-fill');
        if (effBar) {
          const width = effBar.getAttribute('data-width');
          setTimeout(() => {
            effBar.style.width = width;
          }, 300);
        }
        // Animate severity bars
        const sevBar = entry.target.querySelector('.severity-fill');
        if (sevBar) {
          const width = sevBar.getAttribute('data-width');
          setTimeout(() => {
            sevBar.style.width = width;
          }, 300);
        }
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

// ===== SYMPTOM SELECTOR =====
function initSymptomSelector() {
  const chips = document.querySelectorAll('.symptom-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
    });
  });
}

// ===== TEMPERATURE SLIDER =====
function initTempSlider() {
  const slider = document.getElementById('temp-slider');
  const valueDisplay = document.getElementById('temp-value');
  if (!slider || !valueDisplay) return;

  function updateSliderColor(value) {
    const temp = parseInt(value);
    if (temp < 50) {
      valueDisplay.style.color = '#00e676';
    } else if (temp < 70) {
      valueDisplay.style.color = '#ffd600';
    } else if (temp < 85) {
      valueDisplay.style.color = '#ff6d00';
    } else {
      valueDisplay.style.color = '#ff1744';
    }
    valueDisplay.textContent = temp + '°C';
  }

  slider.addEventListener('input', (e) => {
    updateSliderColor(e.target.value);
  });

  updateSliderColor(slider.value);
}

// ===== AI DIAGNOSTICS ENGINE =====
const diagnosticsDatabase = {
  symptoms: {
    'sudden-shutdown': {
      weight: 3,
      component: 'CPU',
      solutions: [
        { title: 'CPU Thermal Throttling Protection', desc: 'Your CPU is hitting thermal limits causing automatic shutdown. Clean the heatsink, replace thermal paste, and ensure the CPU cooler is seated properly.', priority: 'critical', impact: 95 },
        { title: 'Check CPU Cooler Mounting', desc: 'Verify the heatsink/cooler has proper contact with the CPU IHS. Re-seat with fresh thermal compound.', priority: 'high', impact: 85 }
      ]
    },
    'loud-fans': {
      weight: 2,
      component: 'Cooling',
      solutions: [
        { title: 'Optimize Fan Curve Profile', desc: 'Configure a custom fan curve in BIOS or fan control software to balance noise and cooling performance.', priority: 'medium', impact: 70 },
        { title: 'Replace Worn Fan Bearings', desc: 'Loud grinding noises indicate worn bearings. Replace affected fans with quality replacements like Noctua or be quiet! models.', priority: 'high', impact: 80 }
      ]
    },
    'performance-drop': {
      weight: 3,
      component: 'GPU/CPU',
      solutions: [
        { title: 'Address Thermal Throttling', desc: 'Both CPU and GPU reduce clock speeds when overheating. Monitor temps with HWMonitor and address the hottest component first.', priority: 'critical', impact: 90 },
        { title: 'Improve Case Airflow', desc: 'Reorganize cables and add strategic intake/exhaust fans to improve airflow throughout the chassis.', priority: 'high', impact: 75 }
      ]
    },
    'high-idle-temps': {
      weight: 2,
      component: 'System',
      solutions: [
        { title: 'Reapply Thermal Paste', desc: 'Dried-out thermal paste dramatically reduces heat transfer. Clean with isopropyl alcohol and apply fresh paste (Thermal Grizzly Kryonaut recommended).', priority: 'high', impact: 85 },
        { title: 'Check Background Processes', desc: 'High idle temps may indicate malware or runaway processes. Use Task Manager to identify and eliminate CPU-heavy background tasks.', priority: 'medium', impact: 60 }
      ]
    },
    'blue-screen': {
      weight: 3,
      component: 'RAM/CPU',
      solutions: [
        { title: 'Test RAM Stability', desc: 'Overheating RAM causes data corruption and BSODs. Run MemTest86 and ensure RAM modules have adequate airflow or heatspreaders.', priority: 'critical', impact: 80 },
        { title: 'Check VRM Thermals', desc: 'Motherboard VRMs can overheat under load, causing instability. Add VRM heatsinks or improve case airflow around the CPU socket area.', priority: 'high', impact: 75 }
      ]
    },
    'gpu-artifacts': {
      weight: 3,
      component: 'GPU',
      solutions: [
        { title: 'GPU Thermal Pad Replacement', desc: 'Visual artifacts indicate overheating VRAM or GPU core. Replace thermal pads on VRAM chips and reapply paste on the GPU die.', priority: 'critical', impact: 90 },
        { title: 'Undervolt GPU', desc: 'Reduce GPU voltage while maintaining clock speeds to significantly reduce heat output without performance loss.', priority: 'high', impact: 80 }
      ]
    },
    'hot-exhaust': {
      weight: 1,
      component: 'Case',
      solutions: [
        { title: 'Optimize Case Fan Configuration', desc: 'Follow the positive pressure principle: more intake than exhaust fans. This ensures filtered air and reduces dust buildup.', priority: 'medium', impact: 70 },
        { title: 'Consider Case Upgrade', desc: 'Compact cases restrict airflow. A mesh-front case like Fractal Meshify or Corsair 4000D can drop temps by 5-10°C.', priority: 'low', impact: 65 }
      ]
    },
    'dust-buildup': {
      weight: 2,
      component: 'System',
      solutions: [
        { title: 'Deep Clean All Components', desc: 'Use compressed air to clean heatsinks, fans, and filters. Clean every 3-6 months depending on environment.', priority: 'high', impact: 85 },
        { title: 'Install Dust Filters', desc: 'Add magnetic dust filters to intake positions. This dramatically reduces internal dust accumulation.', priority: 'medium', impact: 70 }
      ]
    }
  },

  getAnalysis(selectedSymptoms, temperature) {
    let allSolutions = [];
    let totalWeight = 0;
    let maxWeight = selectedSymptoms.length * 3;

    selectedSymptoms.forEach(symptom => {
      const data = this.symptoms[symptom];
      if (data) {
        totalWeight += data.weight;
        allSolutions.push(...data.solutions);
      }
    });

    // Temperature-based additions
    if (temperature >= 90) {
      allSolutions.unshift({
        title: '🚨 CRITICAL: Immediate Shutdown Risk',
        desc: `At ${temperature}°C, your system is in the danger zone. Shut down immediately, check cooling system, and do not operate until temperatures are resolved.`,
        priority: 'critical',
        impact: 100
      });
      totalWeight += 3;
    } else if (temperature >= 80) {
      allSolutions.unshift({
        title: '⚠️ Approaching Thermal Limits',
        desc: `${temperature}°C is near the thermal limit for most components. Take immediate action to improve cooling before permanent damage occurs.`,
        priority: 'high',
        impact: 85
      });
      totalWeight += 2;
    } else if (temperature >= 70) {
      allSolutions.push({
        title: 'Preventive Cooling Enhancement',
        desc: `${temperature}°C is warm but manageable. Consider proactive improvements to maintain component longevity.`,
        priority: 'medium',
        impact: 60
      });
      totalWeight += 1;
    }

    // Calculate risk score (0-100)
    const riskScore = Math.min(100, Math.round((totalWeight / Math.max(maxWeight + 3, 1)) * 100 + (temperature - 30) * 0.5));

    // Deduplicate and sort by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const seen = new Set();
    allSolutions = allSolutions.filter(s => {
      if (seen.has(s.title)) return false;
      seen.add(s.title);
      return true;
    }).sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return {
      riskScore: Math.min(riskScore, 98),
      solutions: allSolutions.slice(0, 6),
      componentsFocused: [...new Set(selectedSymptoms.map(s => this.symptoms[s]?.component).filter(Boolean))]
    };
  }
};

function initDiagnostics() {
  const analyzeBtn = document.getElementById('analyze-btn');
  if (!analyzeBtn) return;

  analyzeBtn.addEventListener('click', () => {
    const selectedChips = document.querySelectorAll('.symptom-chip.active');
    const slider = document.getElementById('temp-slider');

    if (selectedChips.length === 0) {
      // Brief visual feedback
      analyzeBtn.style.boxShadow = '0 0 20px rgba(255, 23, 68, 0.5)';
      setTimeout(() => analyzeBtn.style.boxShadow = '', 500);
      return;
    }

    const symptoms = Array.from(selectedChips).map(c => c.getAttribute('data-symptom'));
    const temperature = parseInt(slider.value);

    // Show loading state
    analyzeBtn.classList.add('loading');

    // Simulate AI processing
    setTimeout(() => {
      const result = diagnosticsDatabase.getAnalysis(symptoms, temperature);
      displayResults(result);
      analyzeBtn.classList.remove('loading');
    }, 1500);
  });
}

function displayResults(result) {
  const placeholder = document.querySelector('.results-placeholder');
  const content = document.querySelector('.results-content');
  if (!placeholder || !content) return;

  placeholder.style.display = 'none';
  content.classList.add('active');

  // Animate score circle
  const scoreValue = content.querySelector('.score-value');
  const scoreProgress = content.querySelector('.score-progress');
  const scoreLabel = content.querySelector('.score-label');

  // Determine color based on score
  let strokeColor;
  let label;
  if (result.riskScore >= 75) {
    strokeColor = '#ff1744';
    label = 'Critical Risk';
  } else if (result.riskScore >= 50) {
    strokeColor = '#ff6d00';
    label = 'High Risk';
  } else if (result.riskScore >= 30) {
    strokeColor = '#ffd600';
    label = 'Moderate Risk';
  } else {
    strokeColor = '#00e676';
    label = 'Low Risk';
  }

  // Animate counter
  let currentScore = 0;
  const scoreInterval = setInterval(() => {
    currentScore += 2;
    if (currentScore >= result.riskScore) {
      currentScore = result.riskScore;
      clearInterval(scoreInterval);
    }
    scoreValue.textContent = currentScore;
  }, 20);

  scoreValue.style.color = strokeColor;
  scoreLabel.textContent = label;
  scoreLabel.style.color = strokeColor;

  // SVG circle progress
  const circumference = 2 * Math.PI * 52;
  scoreProgress.style.stroke = strokeColor;
  scoreProgress.style.strokeDasharray = circumference;
  scoreProgress.style.strokeDashoffset = circumference;
  setTimeout(() => {
    scoreProgress.style.strokeDashoffset = circumference - (result.riskScore / 100) * circumference;
  }, 100);

  // Render recommendations
  const recContainer = content.querySelector('.result-recommendations');
  recContainer.innerHTML = '';

  result.solutions.forEach((sol, index) => {
    const rec = document.createElement('div');
    rec.className = 'recommendation';
    rec.style.animationDelay = `${index * 0.1}s`;
    rec.innerHTML = `
      <div class="recommendation-header">
        <span class="recommendation-priority priority-${sol.priority}">${sol.priority}</span>
        <h4>${sol.title}</h4>
      </div>
      <p>${sol.desc}</p>
      <div class="recommendation-impact">
        <span>Effectiveness</span>
        <div class="impact-bar"><div class="impact-fill" style="width: ${sol.impact}%; background: ${sol.impact >= 80 ? '#00e676' : sol.impact >= 60 ? '#ffd600' : '#ff6d00'}"></div></div>
        <span style="color: ${sol.impact >= 80 ? '#00e676' : sol.impact >= 60 ? '#ffd600' : '#ff6d00'}">${sol.impact}%</span>
      </div>
    `;
    recContainer.appendChild(rec);
  });
}

// ===== TEMPERATURE DASHBOARD =====
function initDashboard() {
  const tempCards = document.querySelectorAll('.temp-card');

  function updateTemps() {
    tempCards.forEach(card => {
      const baseTemp = parseInt(card.getAttribute('data-base-temp'));
      const variance = parseInt(card.getAttribute('data-variance'));
      const fluctuation = Math.round(baseTemp + (Math.random() - 0.5) * variance);

      const valueEl = card.querySelector('.temp-card-value');
      const statusEl = card.querySelector('.temp-card-status');

      valueEl.textContent = fluctuation + '°C';

      if (fluctuation >= 85) {
        valueEl.style.color = '#ff1744';
        statusEl.textContent = 'Critical';
        statusEl.className = 'temp-card-status status-critical';
        card.classList.add('critical-pulse');
      } else if (fluctuation >= 70) {
        valueEl.style.color = '#ff6d00';
        statusEl.textContent = 'Warning';
        statusEl.className = 'temp-card-status status-warning';
        card.classList.remove('critical-pulse');
      } else {
        valueEl.style.color = '#00e676';
        statusEl.textContent = 'Normal';
        statusEl.className = 'temp-card-status status-normal';
        card.classList.remove('critical-pulse');
      }
    });
  }

  updateTemps();
  setInterval(updateTemps, 3000);

  // Animate mini charts
  animateMiniCharts();
}

function animateMiniCharts() {
  const charts = document.querySelectorAll('.mini-chart');
  charts.forEach(chart => {
    const polyline = chart.querySelector('polyline:not(.chart-area)');
    const area = chart.querySelector('.chart-area');
    if (!polyline) return;

    function generatePoints() {
      const width = 200;
      const height = 60;
      const points = [];
      const numPoints = 20;
      for (let i = 0; i < numPoints; i++) {
        const x = (i / (numPoints - 1)) * width;
        const y = height * 0.2 + Math.random() * height * 0.6;
        points.push(`${x},${y}`);
      }
      return points.join(' ');
    }

    function updateChart() {
      const pts = generatePoints();
      polyline.setAttribute('points', pts);
      if (area) {
        area.setAttribute('points', `0,60 ${pts} 200,60`);
      }
    }

    updateChart();
    setInterval(updateChart, 3000);
  });
}

// ===== 3D TILT EFFECT =====
function initTiltEffect() {
  const cards = document.querySelectorAll('.component-card, .problem-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -5;
      const rotateY = (x - centerX) / centerX * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ===== COUNTER ANIMATION =====
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        let current = 0;
        const increment = Math.ceil(target / 60);
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = prefix + current.toLocaleString() + suffix;
        }, 30);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// ===== HERO TEMPERATURE ANIMATION =====
function initHeroTemp() {
  const tempEl = document.querySelector('.temp-reading .value');
  if (!tempEl) return;

  const temps = [42, 45, 67, 82, 91, 78, 55, 42, 38, 65, 88, 72, 48];
  let index = 0;

  function updateTemp() {
    const temp = temps[index];
    tempEl.textContent = temp;

    const barFill = document.querySelector('.temp-bar-fill');
    if (barFill) {
      barFill.style.width = temp + '%';
      if (temp >= 85) {
        barFill.style.background = 'linear-gradient(90deg, #ff6d00, #ff1744)';
      } else if (temp >= 65) {
        barFill.style.background = 'linear-gradient(90deg, #ffd600, #ff6d00)';
      } else {
        barFill.style.background = 'linear-gradient(90deg, #00e5ff, #00e676)';
      }
    }

    index = (index + 1) % temps.length;
  }

  setInterval(updateTemp, 3000);
}

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', () => {
  new ParticleSystem('particle-canvas');
  initNavbar();
  initScrollProgress();
  initScrollAnimations();
  initSymptomSelector();
  initTempSlider();
  initDiagnostics();
  initDashboard();
  initTiltEffect();
  initSmoothScroll();
  initCounters();
  initHeroTemp();
});
