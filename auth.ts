import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

interface AuthResult {
  success: boolean;
  user?: any;
  error?: string;
}

export class AuthService {
  private static currentUser: any = null;

  static async signInWithGoogle(): Promise<AuthResult> {
    try {
      // In a real app, you would configure these with your Google OAuth credentials
      const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
      
      const request = new AuthSession.AuthRequest({
        clientId: 'your-google-client-id',
        scopes: ['openid', 'profile', 'email'],
        redirectUri,
        responseType: AuthSession.ResponseType.Code,
      });

      // For demo purposes, simulate successful authentication
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        provider: 'google',
      };

      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      this.currentUser = mockUser;

      return { success: true, user: mockUser };
    } catch (error) {
      return { success: false, error: 'Google authentication failed' };
    }
  }

  static async signInWithMicrosoft(): Promise<AuthResult> {
    try {
      // In a real app, you would configure these with your Microsoft OAuth credentials
      const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
      
      const request = new AuthSession.AuthRequest({
        clientId: 'your-microsoft-client-id',
        scopes: ['openid', 'profile', 'email'],
        redirectUri,
        responseType: AuthSession.ResponseType.Code,
      });

      // For demo purposes, simulate successful authentication
      const mockUser = {
        id: '2',
        name: 'John Doe',
        email: 'john.doe@outlook.com',
        provider: 'microsoft',
      };

      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      this.currentUser = mockUser;

      return { success: true, user: mockUser };
    } catch (error) {
      return { success: false, error: 'Microsoft authentication failed' };
    }
  }

  static async getCurrentUser() {
    if (this.currentUser) {
      return this.currentUser;
    }

    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        this.currentUser = JSON.parse(userData);
        return this.currentUser;
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }

    return null;
  }

  static async signOut(): Promise<void> {
    try {
      await AsyncStorage.removeItem('user');
      this.currentUser = null;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return !!user;
  }
}