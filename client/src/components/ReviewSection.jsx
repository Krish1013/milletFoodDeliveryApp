import { FiStar, FiMic, FiPlay, FiPause } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { submitReview, fetchFoodReviews, resetSubmitSuccess } from '../store/reviewSlice';
import toast from 'react-hot-toast';

export default function ReviewSection({ foodId }) {
    const dispatch = useDispatch();
    const { reviews, sentimentSummary, loading, submitSuccess } = useSelector(state => state.review);
    const { user } = useSelector(state => state.auth);
    const [rating, setRating] = useState(5);
    const [text, setText] = useState('');
    const [hoverRating, setHoverRating] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [voiceTranscript, setVoiceTranscript] = useState('');
    const [audioBlob, setAudioBlob] = useState(null);
    const [playingId, setPlayingId] = useState(null);
    const recognitionRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioRef = useRef(null);

    useEffect(() => {
        dispatch(fetchFoodReviews(foodId));
    }, [dispatch, foodId]);

    useEffect(() => {
        if (submitSuccess) {
            toast.success('Review submitted! Thank you 🙏');
            setText('');
            setVoiceTranscript('');
            setRating(5);
            setAudioBlob(null);
            dispatch(resetSubmitSuccess());
            dispatch(fetchFoodReviews(foodId));
        }
    }, [submitSuccess, dispatch, foodId]);

    const startRecording = async () => {
        try {
            // Start speech recognition
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'en-IN';
                recognition.onresult = (e) => {
                    let transcript = '';
                    for (let i = 0; i < e.results.length; i++) {
                        transcript += e.results[i][0].transcript;
                    }
                    setVoiceTranscript(transcript);
                };
                recognition.onerror = () => {
                    toast.error('Speech recognition error. Try using Chrome.');
                    setIsRecording(false);
                };
                recognitionRef.current = recognition;
                recognition.start();
            }

            // Start audio recording
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            const chunks = [];
            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                setAudioBlob(blob);
                stream.getTracks().forEach(t => t.stop());
            };
            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start();
            setIsRecording(true);
            toast.success('🎙️ Recording started! Speak now...');
        } catch (err) {
            toast.error('Microphone access denied');
        }
    };

    const stopRecording = () => {
        if (recognitionRef.current) recognitionRef.current.stop();
        if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
        setIsRecording(false);
        toast.success('Recording stopped!');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) { toast.error('Please login to submit a review'); return; }

        let audioData = '';
        if (audioBlob) {
            const reader = new FileReader();
            audioData = await new Promise((resolve) => {
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(audioBlob);
            });
        }

        dispatch(submitReview({
            foodItem: foodId,
            rating,
            text,
            voiceTranscript,
            audioData
        }));
    };

    const getSentimentColor = (label) => {
        if (label === 'positive') return 'text-green-600 bg-green-50';
        if (label === 'negative') return 'text-red-600 bg-red-50';
        return 'text-amber-600 bg-amber-50';
    };

    const getSentimentEmoji = (label) => {
        if (label === 'positive') return '😊';
        if (label === 'negative') return '😞';
        return '😐';
    };

    return (
        <div className="mt-8">
            <h3 className="text-2xl font-extrabold text-gray-900 mb-6">Reviews & Testimonials</h3>

            {/* Sentiment Summary */}
            {sentimentSummary && (sentimentSummary.positive + sentimentSummary.neutral + sentimentSummary.negative > 0) && (
                <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-2xl">
                    <div className="text-center flex-1 p-3 bg-green-50 rounded-xl">
                        <div className="text-2xl">😊</div>
                        <div className="text-lg font-bold text-green-700">{sentimentSummary.positive}</div>
                        <div className="text-xs text-green-600">Positive</div>
                    </div>
                    <div className="text-center flex-1 p-3 bg-amber-50 rounded-xl">
                        <div className="text-2xl">😐</div>
                        <div className="text-lg font-bold text-amber-700">{sentimentSummary.neutral}</div>
                        <div className="text-xs text-amber-600">Neutral</div>
                    </div>
                    <div className="text-center flex-1 p-3 bg-red-50 rounded-xl">
                        <div className="text-2xl">😞</div>
                        <div className="text-lg font-bold text-red-700">{sentimentSummary.negative}</div>
                        <div className="text-xs text-red-600">Negative</div>
                    </div>
                </div>
            )}

            {/* Submit Review Form */}
            {user && (
                <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                    <h4 className="font-bold text-gray-800 mb-4">Write Your Review</h4>

                    {/* Star Rating */}
                    <div className="flex gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button key={star} type="button"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                className="transition-transform hover:scale-110">
                                <FiStar size={28}
                                    className={(hoverRating || rating) >= star ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
                                    fill={(hoverRating || rating) >= star ? 'currentColor' : 'none'} />
                            </button>
                        ))}
                        <span className="ml-2 text-sm text-gray-500 self-center">{rating}/5</span>
                    </div>

                    {/* Text Review */}
                    <textarea value={text} onChange={(e) => setText(e.target.value)}
                        placeholder="Share your experience with this dish..."
                        className="input-field mb-4 h-24 resize-none" />

                    {/* Voice Review */}
                    <div className="flex items-center gap-3 mb-4">
                        <button type="button" onClick={isRecording ? stopRecording : startRecording}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isRecording
                                    ? 'bg-red-500 text-white animate-pulse'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}>
                            <FiMic size={16} />
                            {isRecording ? 'Stop Recording' : '🎙️ Record Voice Review'}
                        </button>
                        {voiceTranscript && (
                            <p className="text-xs text-gray-500 italic flex-1">"{voiceTranscript}"</p>
                        )}
                    </div>

                    <button type="submit" disabled={loading}
                        className="btn-primary w-full disabled:opacity-50">
                        {loading ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.map(review => (
                    <div key={review._id} className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm animate-fade-in">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                    style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}>
                                    {review.user?.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">{review.user?.name || 'Anonymous'}</p>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <FiStar key={s} size={12}
                                                className={s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
                                                fill={s <= review.rating ? 'currentColor' : 'none'} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${getSentimentColor(review.sentimentLabel)}`}>
                                    {getSentimentEmoji(review.sentimentLabel)} {review.sentimentLabel}
                                </span>
                                <span className="text-[10px] text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        {review.text && <p className="text-sm text-gray-700 mb-2">{review.text}</p>}
                        {review.voiceTranscript && (
                            <p className="text-sm text-gray-600 italic mb-2 flex items-center gap-1">
                                <FiMic size={12} className="text-purple-500" /> "{review.voiceTranscript}"
                            </p>
                        )}
                        {review.audioData && (
                            <button onClick={() => {
                                if (playingId === review._id) { audioRef.current?.pause(); setPlayingId(null); }
                                else {
                                    const audio = new Audio(review.audioData);
                                    audioRef.current = audio;
                                    audio.play();
                                    audio.onended = () => setPlayingId(null);
                                    setPlayingId(review._id);
                                }
                            }}
                                className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-semibold">
                                {playingId === review._id ? <><FiPause size={12} /> Playing...</> : <><FiPlay size={12} /> Play Voice Testimonial</>}
                            </button>
                        )}
                    </div>
                ))}
                {reviews.length === 0 && (
                    <p className="text-center text-gray-400 py-8">No reviews yet. Be the first to review! ✍️</p>
                )}
            </div>
        </div>
    );
}
