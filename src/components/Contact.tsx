import { useState } from 'react';
import { Send, User, Mail, MessageSquare } from 'lucide-react';

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" className="contact">
      <div className="container-narrow">
        <div className="contact-header">
          <span className="section-eyebrow">Contact</span>
          <h2 className="section-title">Une question ? Écrivez-nous</h2>
          <p className="section-subtitle">
            Notre équipe vous répond sous 24 heures.
          </p>
        </div>

        <form 
          onSubmit={handleSubmit} 
          className="contact-form"
        >
          <div className="form-row">
            {/* Nom */}
            <div>
              <label className="form-label">Nom</label>
              <div className="form-input-wrapper">
                <User className="form-icon" />
                <input
                  type="text"
                  required
                  placeholder="Votre nom"
                  className="form-input"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="form-label">Email</label>
              <div className="form-input-wrapper">
                <Mail className="form-icon" />
                <input
                  type="email"
                  required
                  placeholder="vous@email.com"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="form-label">Message</label>
            <div className="form-input-wrapper">
              <MessageSquare className="form-textarea-icon" />
              <textarea
                required
                rows={5}
                placeholder="Votre message..."
                className="form-textarea"
              />
            </div>
          </div>

          <button type="submit" className="btn-submit">
            {sent ? 'Message envoyé !' : 'Envoyer'}
            {!sent && <Send className="w-5 h-5" />}
          </button>

          {sent && (
            <p className="contact-success">
              Merci ! Nous vous répondrons rapidement.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
