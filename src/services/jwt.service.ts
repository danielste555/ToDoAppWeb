// src/app/services/jwt.service.ts

export class JwtService {
  private static readonly CLAIM_TYPES = {
    NameIdentifier: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
    Email: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
    Name: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
  };

  /**
   * Parse un JWT token et retourne son payload
   * @param token JWT token à parser
   * @returns Payload décodé ou null si invalide
   */
  static parseToken(token: string): any | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Erreur lors du parsing du token:', e);
      return null;
    }
  }

  /**
   * Récupère une claim spécifique du token
   * @param token JWT token
   * @param claim Claim à récupérer
   * @returns Valeur de la claim ou null
   */
  static getClaim(token: string, claim: string): any {
    const payload = this.parseToken(token);
    return payload ? payload[claim] : null;
  }

  /**
   * Récupère l'ID utilisateur depuis le token
   */
  // Dans JwtService
    static getUserId(token: string | null): string | null {
        if (!token) return null;
        try {
            return this.getClaim(token, this.CLAIM_TYPES.NameIdentifier);
        } catch {
            return null;
        }
    }

  /**
   * Récupère l'email utilisateur depuis le token
   */
  static getUserEmail(token: string): string | null {
    return this.getClaim(token, this.CLAIM_TYPES.Email);
  }

  /**
   * Récupère le nom utilisateur depuis le token
   */
  static getUserName(token: string | null): string | null {
    if (!token) return null;
    try {
            return this.getClaim(token, this.CLAIM_TYPES.Name);
    } catch {
            return null;
        }
    
  }

  /**
   * Vérifie si le token est expiré
   */
  static isTokenExpired(token: string): boolean {
    const payload = this.parseToken(token);
    if (!payload || !payload.exp) return true;
    
    return payload.exp * 1000 < Date.now();
  }

  /**
   * Récupère la date d'expiration
   */
  static getExpirationDate(token: string): Date | null {
    const payload = this.parseToken(token);
    if (!payload || !payload.exp) return null;
    
    return new Date(payload.exp * 1000);
  }
}