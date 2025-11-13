import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, X } from 'lucide-react';

const KYC = () => {
  const [kycStatus, setKycStatus] = useState<any>(null);
  const [idNumber, setIdNumber] = useState<string>('');
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchKYCStatus();
  }, []);

  const fetchKYCStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('kyc_documents')
      .select('*')
      .eq('user_id', user.id)
      .single();

    setKycStatus(data);
  };

  // Helper to generate preview from file
  const generatePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  // Handle front ID file upload
  const handleFrontFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFrontFile(file);
    if (file) {
      const preview = await generatePreview(file);
      setFrontPreview(preview);
    } else {
      setFrontPreview(null);
    }
  };

  // Handle back ID file upload
  const handleBackFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setBackFile(file);
    if (file) {
      const preview = await generatePreview(file);
      setBackPreview(preview);
    } else {
      setBackPreview(null);
    }
  };

  // Handle selfie file upload
  const handleSelfieFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelfieFile(file);
    if (file) {
      const preview = await generatePreview(file);
      setSelfiePreview(preview);
    } else {
      setSelfiePreview(null);
    }
  };

  // Clear selfie and allow retake
  const handleRetakeSelfie = () => {
    setSelfieFile(null);
    setSelfiePreview(null);
    setCameraOpen(false);
    // Stop camera if running
    const stream = videoRef.current?.srcObject as MediaStream | null;
    stream?.getTracks().forEach(t => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!frontFile || !selfieFile || !idNumber) {
      toast({ title: 'Missing fields', description: 'Please provide ID number, front/back ID images and a selfie.', variant: 'destructive' });
      return;
    }
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const bucket = (process.env.VITE_SUPABASE_KYC_BUCKET as string) || 'kyc-documents';

      // Upload front ID
      const frontExt = frontFile!.name.split('.').pop();
      const frontName = `${user.id}-id-front-${Date.now()}.${frontExt}`;
      const { error: frontError } = await supabase.storage
        .from(bucket)
        .upload(frontName, frontFile!);
      if (frontError) {
        if (frontError.message && frontError.message.toLowerCase().includes('bucket')) {
          throw new Error(`Storage bucket "${bucket}" not found. Please create this bucket in Supabase storage or contact support.`);
        }
        throw frontError;
      }

      // Upload back ID (optional)
      let backName: string | null = null;
      if (backFile) {
        const backExt = backFile.name.split('.').pop();
        backName = `${user.id}-id-back-${Date.now()}.${backExt}`;
        const { error: backError } = await supabase.storage.from(bucket).upload(backName, backFile);
        if (backError) throw backError;
      }

      // Upload selfie
      const selfieExt = selfieFile.name.split('.').pop();
      const selfieFileName = `${user.id}-selfie-${Date.now()}.${selfieExt}`;
      const { error: selfieError } = await supabase.storage
        .from(bucket)
        .upload(selfieFileName, selfieFile);
      if (selfieError) throw selfieError;

      // Save to database
      const { error } = await supabase.from('kyc_documents').upsert({
        user_id: user.id,
        id_number: idNumber,
        id_front_url: frontName,
        id_back_url: backName,
        selfie_url: selfieFileName,
        status: 'pending'
      });

      if (error) throw error;

      toast({
        title: 'KYC Submitted',
        description: 'Your documents have been submitted for review.',
      });

      fetchKYCStatus();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-500',
      under_review: 'bg-blue-500',
      approved: 'bg-green-500',
      rejected: 'bg-red-500'
    };
    return <Badge className={colors[status] || 'bg-gray-500'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">KYC Verification</h1>
        <p className="text-muted-foreground mt-2">Complete your identity verification</p>
      </div>

      {kycStatus && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>KYC Status</CardTitle>
              {getStatusBadge(kycStatus.status)}
            </div>
          </CardHeader>
          <CardContent>
            {kycStatus.rejection_reason && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800"><strong>Rejection Reason:</strong> {kycStatus.rejection_reason}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {(!kycStatus || kycStatus.status === 'rejected') && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="idNumber">ID Number</Label>
                <Input
                  id="idNumber"
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="Enter ID / Passport number"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="front">Front of ID</Label>
                  <Input
                    id="front"
                    type="file"
                    accept="image/*"
                    onChange={handleFrontFileChange}
                    required
                  />
                  {frontPreview && (
                    <div className="mt-2 relative">
                      <img src={frontPreview} alt="Front ID Preview" className="w-full rounded-lg border border-gray-300 max-h-40 object-cover" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white h-6 w-6"
                        onClick={() => {
                          const input = document.getElementById('front') as HTMLInputElement;
                          if (input) input.value = '';
                          setFrontFile(null);
                          setFrontPreview(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="back">Back of ID (if applicable)</Label>
                  <Input
                    id="back"
                    type="file"
                    accept="image/*"
                    onChange={handleBackFileChange}
                  />
                  {backPreview && (
                    <div className="mt-2 relative">
                      <img src={backPreview} alt="Back ID Preview" className="w-full rounded-lg border border-gray-300 max-h-40 object-cover" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white h-6 w-6"
                        onClick={() => {
                          const input = document.getElementById('back') as HTMLInputElement;
                          if (input) input.value = '';
                          setBackFile(null);
                          setBackPreview(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Selfie with ID</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="selfie"
                    type="file"
                    accept="image/*"
                    onChange={handleSelfieFileChange}
                  />
                  <Button type="button" variant="outline" onClick={async () => {
                    if (!cameraOpen) {
                      try {
                        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                        if (videoRef.current) videoRef.current.srcObject = stream;
                        setCameraOpen(true);
                      } catch (err) {
                        toast({ title: 'Camera Error', description: 'Unable to access camera.', variant: 'destructive' });
                      }
                    } else {
                      // stop camera
                      const stream = videoRef.current?.srcObject as MediaStream | null;
                      stream?.getTracks().forEach(t => t.stop());
                      if (videoRef.current) videoRef.current.srcObject = null;
                      setCameraOpen(false);
                    }
                  }}>{cameraOpen ? 'Close Camera' : 'Take Photo'}</Button>
                </div>

                {selfiePreview && !cameraOpen && (
                  <div className="mt-3 relative">
                    <img src={selfiePreview} alt="Selfie Preview" className="w-full rounded-lg border border-gray-300 max-h-48 object-cover" />
                    <Button
                      type="button"
                      variant="outline"
                      className="absolute top-2 right-2"
                      onClick={handleRetakeSelfie}
                    >
                      Retake
                    </Button>
                  </div>
                )}

                {cameraOpen && (
                  <div className="mt-3">
                    <video ref={videoRef} autoPlay playsInline className="w-full max-w-sm rounded-lg" />
                    <div className="mt-2 flex space-x-2">
                      <Button type="button" onClick={() => {
                        if (!videoRef.current) return;
                        const video = videoRef.current;
                        const canvas = document.createElement('canvas');
                        canvas.width = video.videoWidth || 640;
                        canvas.height = video.videoHeight || 480;
                        const ctx = canvas.getContext('2d');
                        if (!ctx) return;
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                        canvas.toBlob((blob) => {
                          if (!blob) return;
                          const file = new File([blob], `selfie-${Date.now()}.jpg`, { type: 'image/jpeg' });
                          setSelfieFile(file);
                          generatePreview(file).then(preview => {
                            setSelfiePreview(preview);
                          });
                          // stop camera after capture
                          const stream = video.srcObject as MediaStream | null;
                          stream?.getTracks().forEach(t => t.stop());
                          video.srcObject = null;
                          setCameraOpen(false);
                          toast({ title: 'Photo captured', description: 'Selfie saved. You can submit now.' });
                        }, 'image/jpeg');
                      }}>Capture</Button>
                      <Button type="button" variant="outline" onClick={() => {
                        const stream = videoRef.current?.srcObject as MediaStream | null;
                        stream?.getTracks().forEach(t => t.stop());
                        if (videoRef.current) videoRef.current.srcObject = null;
                        setCameraOpen(false);
                      }}>Cancel</Button>
                    </div>
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Uploading...' : 'Submit KYC Documents'}
                <Upload className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KYC;
