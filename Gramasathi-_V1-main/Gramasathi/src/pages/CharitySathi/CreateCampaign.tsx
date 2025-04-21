import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, 
  Upload, 
  X, 
  Info, 
  ArrowLeft 
} from 'lucide-react';
import { useAuth } from '../../hooks/AuthContext';
import useApi from '../../hooks/useApi';
import { Button } from '../../components/ui/Button';
import { useVoiceContext } from '../../hooks/VoiceContext';

const CreateCampaign: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const api = useApi();
  const { speak } = useVoiceContext();
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [endDate, setEndDate] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [beneficiaries, setBeneficiaries] = useState('');
  const [images, setImages] = useState<FileList | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  
  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check authentication
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/charity/create' } });
    }
  }, [isAuthenticated, navigate]);
  
  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Limit to 5 images
    if (files.length > 5) {
      setErrors(prev => ({ ...prev, images: t('campaign.maxImagesError') }));
      return;
    }
    
    setImages(files);
    
    // Generate preview URLs
    const previews: string[] = [];
    for (let i = 0; i < files.length; i++) {
      previews.push(URL.createObjectURL(files[i]));
    }
    setPreviewImages(previews);
    
    // Clear any previous errors
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.images;
      return newErrors;
    });
  };
  
  // Remove image from selection
  const removeImage = (index: number) => {
    const newPreviews = [...previewImages];
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);
    
    if (images) {
      const dataTransfer = new DataTransfer();
      for (let i = 0; i < images.length; i++) {
        if (i !== index) {
          dataTransfer.items.add(images[i]);
        }
      }
      setImages(dataTransfer.files);
    }
  };
  
  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) newErrors.title = t('validation.required');
    if (!description.trim()) newErrors.description = t('validation.required');
    if (!category.trim()) newErrors.category = t('validation.required');
    
    if (!targetAmount.trim()) {
      newErrors.targetAmount = t('validation.required');
    } else if (isNaN(Number(targetAmount)) || Number(targetAmount) <= 0) {
      newErrors.targetAmount = t('validation.invalidAmount');
    }
    
    if (!endDate.trim()) {
      newErrors.endDate = t('validation.required');
    } else {
      const selectedDate = new Date(endDate);
      const today = new Date();
      if (selectedDate <= today) {
        newErrors.endDate = t('validation.futureDate');
      }
    }
    
    if (!village.trim()) newErrors.village = t('validation.required');
    if (!district.trim()) newErrors.district = t('validation.required');
    if (!state.trim()) newErrors.state = t('validation.required');
    if (!beneficiaries.trim()) newErrors.beneficiaries = t('validation.required');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      speak(t('campaign.formErrors'));
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create form data
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('targetAmount', targetAmount);
      formData.append('endDate', endDate);
      formData.append('village', village);
      formData.append('district', district);
      formData.append('state', state);
      formData.append('beneficiaries', beneficiaries);
      
      // Add images
      if (images) {
        for (let i = 0; i < images.length; i++) {
          formData.append('images', images[i]);
        }
      }
      
      const response = await api.request('/charity', {
        method: 'POST',
        body: formData,
        isFormData: true
      });
      
      if (response.data && response.data.id) {
        speak(t('campaign.createSuccess'));
        navigate(`/charity/${response.data.id}`);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error creating campaign:', err);
      setErrors(prev => ({ ...prev, form: t('campaign.createError') }));
      speak(t('campaign.createError'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const categoryOptions = [
    { value: 'education', label: t('categories.education') },
    { value: 'healthcare', label: t('categories.healthcare') },
    { value: 'disaster', label: t('categories.disaster') },
    { value: 'infrastructure', label: t('categories.infrastructure') },
    { value: 'community', label: t('categories.community') },
    { value: 'other', label: t('categories.other') }
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/charity" className="mr-4">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">{t('campaign.createNew')}</h1>
        </div>
        
        {errors.form && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <span className="block sm:inline">{errors.form}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                {t('campaign.title')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                placeholder={t('campaign.titlePlaceholder')}
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                {t('campaign.description')} <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className={`w-full px-3 py-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                placeholder={t('campaign.descriptionPlaceholder')}
              ></textarea>
              {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>
            
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                {t('campaign.category')} <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">{t('campaign.selectCategory')}</option>
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
            </div>
            
            {/* Target Amount */}
            <div>
              <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 mb-1">
                {t('campaign.targetAmount')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                <input
                  type="number"
                  id="targetAmount"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className={`w-full pl-7 px-3 py-2 border rounded-md ${errors.targetAmount ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="10000"
                  min="1"
                />
              </div>
              {errors.targetAmount && <p className="mt-1 text-sm text-red-500">{errors.targetAmount}</p>}
            </div>
            
            {/* End Date */}
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                {t('campaign.endDate')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar size={16} className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-500" />
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`w-full pl-10 px-3 py-2 border rounded-md ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              {errors.endDate && <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>}
            </div>
            
            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="village" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('campaign.village')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="village"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${errors.village ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder={t('campaign.villagePlaceholder')}
                />
                {errors.village && <p className="mt-1 text-sm text-red-500">{errors.village}</p>}
              </div>
              <div>
                <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('campaign.district')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${errors.district ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder={t('campaign.districtPlaceholder')}
                />
                {errors.district && <p className="mt-1 text-sm text-red-500">{errors.district}</p>}
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('campaign.state')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder={t('campaign.statePlaceholder')}
                />
                {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
              </div>
            </div>
            
            {/* Beneficiaries */}
            <div>
              <label htmlFor="beneficiaries" className="block text-sm font-medium text-gray-700 mb-1">
                {t('campaign.beneficiaries')} <span className="text-red-500">*</span>
              </label>
              <textarea
                id="beneficiaries"
                value={beneficiaries}
                onChange={(e) => setBeneficiaries(e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md ${errors.beneficiaries ? 'border-red-500' : 'border-gray-300'}`}
                placeholder={t('campaign.beneficiariesPlaceholder')}
              ></textarea>
              {errors.beneficiaries && <p className="mt-1 text-sm text-red-500">{errors.beneficiaries}</p>}
            </div>
            
            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('campaign.images')} <span className="text-gray-500">({t('campaign.optional')})</span>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="images" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark">
                      <span>{t('campaign.uploadImages')}</span>
                      <input
                        id="images"
                        name="images"
                        type="file"
                        multiple
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">{t('campaign.dragDrop')}</p>
                  </div>
                  <p className="text-xs text-gray-500">{t('campaign.imageRequirements')}</p>
                </div>
              </div>
              {errors.images && <p className="mt-1 text-sm text-red-500">{errors.images}</p>}
              
              {/* Image previews */}
              {previewImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {previewImages.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Submit button */}
            <div className="flex items-center justify-end gap-4">
              <Link to="/charity">
                <Button variant="outline" type="button">
                  {t('common.cancel')}
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    {t('common.submitting')}
                  </>
                ) : (
                  t('campaign.createButton')
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign; 