        // Navegación suave
        document.querySelectorAll('.nav-link, .cta-button').forEach(link => {
            link.addEventListener('click', function(e) {
                if (this.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        targetSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });

        // Menú hamburguesa
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Cerrar menú al hacer click en un enlace
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });

        // Función para cargar proyectos de GitHub
        async function loadGithubProjects() {
            const username = document.getElementById('githubUsername').value.trim();
            const container = document.getElementById('projectsContainer');
            
            if (!username) {
                showMessage('Por favor ingresa un nombre de usuario de GitHub', 'error');
                return;
            }

            container.innerHTML = '<div class="loading">Cargando proyectos...</div>';

            try {
                const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
                
                if (!response.ok) {
                    throw new Error('Usuario no encontrado');
                }

                const repos = await response.json();
                
                if (repos.length === 0) {
                    container.innerHTML = '<div class="loading">No se encontraron repositorios públicos</div>';
                    return;
                }

                container.innerHTML = repos.map(repo => `
                    <div class="project-card">
                        <h3>${repo.name}</h3>
                        <p>${repo.description || 'Sin descripción disponible'}</p>
                        <div class="project-links">
                            <a href="${repo.html_url}" class="project-link" target="_blank" rel="noopener noreferrer">Ver Código</a>
                            ${repo.homepage ? `<a href="${repo.homepage}" class="project-link" target="_blank" rel="noopener noreferrer">Demo</a>` : ''}
                        </div>
                    </div>
                `).join('');

            } catch (error) {
                container.innerHTML = '<div class="loading">Error al cargar los proyectos. Verifica el nombre de usuario.</div>';
            }
        }

        function clearProjects() {
            const container = document.getElementById("projectsContainer");
            container.innerHTML = ""; // Limpia todos los proyectos
        }        

        // Función para manejar el envío del formulario
        function handleFormSubmit(event) {
            event.preventDefault();
            
            const formData = new FormData(event.target);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };

            // Validar campos
            if (!data.name || !data.email || !data.subject || !data.message) {
                showMessage('Por favor completa todos los campos', 'error');
                return;
            }

            // Crear el enlace mailto con los datos del formulario
            const mailtoLink = `mailto:julioing05@gmail.com?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(
                `Nombre: ${data.name}\n` +
                `Email: ${data.email}\n` +
                `Asunto: ${data.subject}\n\n` +
                `Mensaje:\n${data.message}\n\n` +
                `---\n` +
                `Este mensaje fue enviado desde tu portafolio web.`
            )}`;

            // Abrir cliente de correo
            try {
                window.location.href = mailtoLink;
                showMessage('¡Abriendo tu cliente de correo! Si no se abre automáticamente, copia la información y envía un email manualmente.', 'success');
                
                // Mostrar información alternativa
                setTimeout(() => {
                    showContactInfo(data);
                }, 2000);
                
                event.target.reset();
            } catch (error) {
                // Si falla el mailto, mostrar información para copiar
                showContactInfo(data);
            }
        }

        // Función para mostrar mensajes
        function showMessage(message, type) {
            const messageDiv = document.createElement('div');
            messageDiv.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 15px 25px;
                border-radius: 10px;
                color: white;
                font-weight: 500;
                z-index: 1001;
                animation: slideIn 0.3s ease;
                background: ${type === 'success' ? '#10b981' : '#ef4444'};
            `;
            messageDiv.textContent = message;
            
            document.body.appendChild(messageDiv);
            
            setTimeout(() => {
                messageDiv.remove();
            }, 4000);
        }

        // Función para manejar la foto del hero
        function handleHeroPhotoUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            // Validar que sea una imagen
            if (!file.type.startsWith('image/')) {
                showMessage('Por favor selecciona un archivo de imagen válido', 'error');
                return;
            }

            // Validar tamaño (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showMessage('La imagen es muy grande. Máximo 5MB permitido', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                const placeholder = document.getElementById('heroPhotoPlaceholder');
                placeholder.innerHTML = `<img src="${e.target.result}" alt="Foto personal" style="width: 100%; height: 100%; object-fit: cover;">`;
                showMessage('¡Foto actualizada correctamente!', 'success');
            };
            reader.readAsDataURL(file);
        }

        // Funciones para manejo de CV
        function handleCVUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            const fileInfo = document.getElementById('cvFileInfo');
            const fileName = fileInfo.querySelector('.cv-file-name');
            const fileSize = fileInfo.querySelector('.cv-file-size');

            fileName.textContent = file.name;
            fileSize.textContent = `Tamaño: ${(file.size / 1024 / 1024).toFixed(2)} MB`;
            
            fileInfo.classList.add('show');
            
            showMessage('CV subido correctamente. ¡Listo para descargar!', 'success');
        }
/*
        function downloadSampleCV() {
            // Crear un CV de ejemplo en formato texto
            const cvContent = `
CURRÍCULUM VITAE

[Tu Nombre Completo]
Desarrollador Full Stack

INFORMACIÓN DE CONTACTO
Email: tu.email@ejemplo.com
Teléfono: +1 (555) 123-4567
LinkedIn: linkedin.com/in/tu-perfil
GitHub: github.com/tu-usuario

RESUMEN PROFESIONAL
Desarrollador Full Stack con más de X años de experiencia en el desarrollo
de aplicaciones web modernas. Especializado en JavaScript, React, Node.js
y tecnologías relacionadas.

EXPERIENCIA LABORAL
Desarrollador Senior - Empresa ABC (2020 - Presente)
• Desarrollo de aplicaciones web con React y Node.js
• Implementación de APIs RESTful
• Colaboración en equipos ágiles

Desarrollador Junior - Empresa XYZ (2018 - 2020)
• Mantenimiento de aplicaciones legacy
• Desarrollo de nuevas funcionalidades
• Testing y debugging

EDUCACIÓN
Ingeniería en Sistemas - Universidad ABC (2014 - 2018)

HABILIDADES TÉCNICAS
• Frontend: HTML, CSS, JavaScript, React, Vue.js
• Backend: Node.js, Python, Express.js
• Bases de datos: MySQL, MongoDB, PostgreSQL
• Herramientas: Git, Docker, AWS

IDIOMAS
• Español: Nativo
• Inglés: Avanzado
            `;

            // Crear y descargar el archivo
            const blob = new Blob([cvContent], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'CV_[Tu_Nombre].txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            showMessage('CV descargado correctamente', 'success');
        }
*/

  // ✅ Esta función hace que se descargue el archivo cv.pdf
  function downloadSampleCV() {
    const link = document.createElement('a');
    link.href = 'cv.pdf'; // nombre del archivo que tengas en tu carpeta
    link.download = 'CV_Julio_Peña.pdf'; // nombre que tendrá al descargar
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

    // ✅ Muestra información del archivo subido
  function handleCVUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    document.querySelector('#cvFileInfo .cv-file-name').textContent = file.name;
    document.querySelector('#cvFileInfo .cv-file-size').textContent =
      (file.size / 1024).toFixed(2) + ' KB';

    const preview = document.querySelector('.cv-preview');
    if (file.type === 'application/pdf') {
      preview.innerHTML = `<iframe src="${URL.createObjectURL(file)}" width="100%" height="400px"></iframe>`;
    } else {
      preview.innerHTML = `<p>Vista previa no disponible para este tipo de archivo.</p>`;
    }
  }

  // ✅ Cargar el CV automáticamente al abrir la página
  window.addEventListener("DOMContentLoaded", () => {
    const preview = document.querySelector(".cv-preview");
    const cvPath = "cv.pdf"; // Ruta del archivo a mostrar automáticamente

    // Verificar si el archivo existe antes de mostrarlo
    fetch(cvPath)
      .then((response) => {
        if (response.ok) {
          preview.innerHTML = `
            <iframe src="${cvPath}" width="100%" height="400px" style="border:none;border-radius:5px;"></iframe>
          `;
        } else {
          preview.innerHTML += `
            <p style="color:#888;">No se encontró el archivo CV para mostrar automáticamente.</p>
          `;
        }
      })
      .catch(() => {
        preview.innerHTML += `
          <p style="color:#888;">Error al cargar el CV automáticamente.</p>
        `;
      });
  });

        // Drag and drop para CV
        const cvUploadArea = document.querySelector('.cv-upload-area');
        
        cvUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            cvUploadArea.classList.add('dragover');
        });

        cvUploadArea.addEventListener('dragleave', () => {
            cvUploadArea.classList.remove('dragover');
        });

        cvUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            cvUploadArea.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                if (file.type === 'application/pdf' || 
                    file.type === 'application/msword' || 
                    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                    
                    document.getElementById('cvFileInput').files = files;
                    handleCVUpload({ target: { files: files } });
                } else {
                    showMessage('Por favor sube un archivo PDF, DOC o DOCX', 'error');
                }
            }
        });

        // Agregar estilos para la animación del mensaje
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);

        // Efecto de scroll en la navegación
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 100) {
                navbar.style.background = 'linear-gradient(to right, #dc2626 0%, #991b1b 20%, #000000 50%, #991b1b 80%, #dc2626 100%)';
                navbar.style.boxShadow = '0 4px 25px rgba(0, 0, 0, 0.4)';
            } else {
                navbar.style.background = 'linear-gradient(to right, #dc2626 0%, #991b1b 20%, #000000 50%, #991b1b 80%, #dc2626 100%)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
            }
        });