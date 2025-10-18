// Sistema de notificaciones por email

interface EmailNotification {
  to: string
  subject: string
  html: string
}

export const notificationService = {
  // Notificación de nuevo contacto al vendedor
  async notifyNewContact(vendedor: any, coche: any, comprador: any, mensaje: string) {
    const emailData: EmailNotification = {
      to: vendedor.email,
      subject: `Nuevo interés en tu ${coche.marca} ${coche.modelo}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">¡Tienes un nuevo contacto!</h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Información del coche:</h3>
            <p><strong>${coche.marca} ${coche.modelo} ${coche.año}</strong></p>
            <p>Precio: €${coche.precio.toLocaleString()}</p>
          </div>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Datos del interesado:</h3>
            <p><strong>Nombre:</strong> ${comprador.nombre}</p>
            <p><strong>Email:</strong> ${comprador.email}</p>
            <p><strong>Teléfono:</strong> ${comprador.telefono}</p>
          </div>
          
          <div style="background: #fefce8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Mensaje:</h3>
            <p>${mensaje}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:${comprador.email}" 
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Responder por Email
            </a>
            <a href="tel:${comprador.telefono}" 
               style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-left: 10px;">
              Llamar Ahora
            </a>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            Este email fue enviado desde SitioCoches.com
          </p>
        </div>
      `
    }
    
    return this.sendEmail(emailData)
  },

  // Notificación de nueva valoración
  async notifyNewRating(vendedor: any, coche: any, valoracion: any) {
    const stars = '⭐'.repeat(valoracion.puntuacion)
    
    const emailData: EmailNotification = {
      to: vendedor.email,
      subject: `Nueva valoración para tu ${coche.marca} ${coche.modelo}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">¡Nueva valoración recibida!</h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>${coche.marca} ${coche.modelo} ${coche.año}</h3>
            <p>Precio: €${coche.precio.toLocaleString()}</p>
          </div>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h3>Puntuación: ${stars}</h3>
            <p style="font-size: 24px; margin: 0;">${valoracion.puntuacion}/5 estrellas</p>
          </div>
          
          ${valoracion.comentario ? `
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h4>Comentario de ${valoracion.nombreUsuario}:</h4>
              <p style="font-style: italic;">"${valoracion.comentario}"</p>
            </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://sitiocoches.com/coches/${coche.id}" 
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Ver Anuncio
            </a>
          </div>
        </div>
      `
    }
    
    return this.sendEmail(emailData)
  },

  // Notificación de coche añadido a favoritos
  async notifyAddedToFavorites(vendedor: any, coche: any) {
    const emailData: EmailNotification = {
      to: vendedor.email,
      subject: `Tu ${coche.marca} ${coche.modelo} fue añadido a favoritos`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">¡Buenas noticias!</h2>
          
          <p>Tu coche ha sido añadido a favoritos por un usuario interesado.</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>${coche.marca} ${coche.modelo} ${coche.año}</h3>
            <p>Precio: €${coche.precio.toLocaleString()}</p>
          </div>
          
          <p>Esto significa que hay interés en tu vehículo. ¡Mantén tu anuncio actualizado!</p>
        </div>
      `
    }
    
    return this.sendEmail(emailData)
  },

  // Envío de email (implementación simplificada)
  async sendEmail(emailData: EmailNotification) {
    try {
      // En producción, usar un servicio como SendGrid, Mailgun, etc.
      console.log('Sending email:', emailData)
      
      // Simulación de envío exitoso
      return { success: true, messageId: `msg_${Date.now()}` }
    } catch (error) {
      console.error('Error sending email:', error)
      return { success: false, error }
    }
  },

  // Notificaciones push (para futuro)
  async sendPushNotification(userId: string, title: string, body: string) {
    // Implementar con service workers y Push API
    console.log('Push notification:', { userId, title, body })
  }
}