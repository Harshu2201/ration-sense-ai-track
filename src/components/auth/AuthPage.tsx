
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Building2, Shield, Users, Globe } from "lucide-react";

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [rationCardNumber, setRationCardNumber] = useState('');
  const [district, setDistrict] = useState('');
  const [block, setBlock] = useState('');
  const [village, setVillage] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('hindi');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Authentication Failed",
            description: error.message || "Invalid credentials. Please check your email and password.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Welcome to RationTrack",
            description: "Successfully logged into the government portal."
          });
          navigate('/');
        }
      } else {
        const { error } = await signUp(email, password, {
          full_name: fullName,
          phone_number: phoneNumber,
          ration_card_number: rationCardNumber,
          district,
          block,
          village,
          preferred_language: preferredLanguage
        });
        
        if (error) {
          toast({
            title: "Registration Failed",
            description: error.message || "Unable to create account. Please try again.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Account Created Successfully",
            description: "Please check your email to verify your account before signing in."
          });
          setIsLogin(true);
        }
      }
    } catch (error) {
      toast({
        title: "System Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex flex-col">
      {/* Government Header */}
      <div className="bg-gradient-to-r from-orange-600 to-green-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3">
            <Building2 className="h-8 w-8" />
            <div className="text-center">
              <h1 className="text-2xl font-bold">Government of India</h1>
              <p className="text-sm opacity-90">Ministry of Consumer Affairs, Food & Public Distribution</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Platform Info */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Building2 className="h-12 w-12 text-orange-600" />
              <div>
                <h2 className="text-3xl font-bold text-gray-800">RationTrack</h2>
                <p className="text-gray-600">Digital PDS Transparency Platform</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-300">
                <Shield className="h-3 w-3 mr-1" />
                Government Verified
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300">
                <Users className="h-3 w-3 mr-1" />
                Public Service
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-300">
                <Globe className="h-3 w-3 mr-1" />
                Multi-Language
              </Badge>
            </div>
          </div>

          <Card className="shadow-lg border-2 border-gray-200">
            <CardHeader className="text-center bg-gradient-to-r from-orange-50 to-green-50">
              <CardTitle className="text-xl text-gray-800">
                {isLogin ? 'Sign In to Your Account' : 'Register for RationTrack'}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {isLogin 
                  ? 'Access your government services dashboard' 
                  : 'Create an account to access PDS services and transparency tools'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter secure password"
                    required
                    className="border-gray-300"
                  />
                </div>

                {!isLogin && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="language">Preferred Language</Label>
                        <LanguageSelector
                          value={preferredLanguage}
                          onValueChange={setPreferredLanguage}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Mobile Number</Label>
                        <Input
                          id="phoneNumber"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+91 9876543210"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="rationCard">Ration Card Number</Label>
                        <Input
                          id="rationCard"
                          value={rationCardNumber}
                          onChange={(e) => setRationCardNumber(e.target.value)}
                          placeholder="Enter ration card number"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="district">District</Label>
                        <Input
                          id="district"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          placeholder="e.g., New Delhi"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="block">Block/Tehsil</Label>
                        <Input
                          id="block"
                          value={block}
                          onChange={(e) => setBlock(e.target.value)}
                          placeholder="e.g., Central Delhi"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="village">Village/Ward</Label>
                        <Input
                          id="village"
                          value={village}
                          onChange={(e) => setVillage(e.target.value)}
                          placeholder="e.g., Karol Bagh"
                        />
                      </div>
                    </div>
                  </>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-orange-600 hover:bg-orange-700" 
                  disabled={loading}
                >
                  {loading 
                    ? 'Please wait...' 
                    : (isLogin ? 'Sign In to Dashboard' : 'Create Government Account')
                  }
                </Button>

                <div className="text-center pt-4">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-gray-600 hover:text-orange-600"
                  >
                    {isLogin 
                      ? "Don't have an account? Register here" 
                      : "Already have an account? Sign in here"
                    }
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Footer Info */}
          <div className="text-center mt-6 text-sm text-gray-500">
            <p>This is an official government portal. Your data is secure and protected.</p>
            <p className="mt-1">For technical support, contact: support@rationtrack.gov.in</p>
          </div>
        </div>
      </div>
    </div>
  );
};
