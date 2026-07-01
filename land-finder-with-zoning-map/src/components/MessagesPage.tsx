import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Clock, 
  CheckCircle, 
  X, 
  Inbox, 
  Search, 
  ChevronRight,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { UserProfile, InquiryMessage, formatToIST } from '../types';

interface MessagesPageProps {
  currentUser: UserProfile;
  messages: InquiryMessage[];
  onUpdateMessageStatus?: (id: string, newStatus: 'accepted' | 'rejected' | 'pending' | 'countered', replyText?: string) => void;
}

export default function MessagesPage({
  currentUser,
  messages = [],
  onUpdateMessageStatus
}: MessagesPageProps) {
  const [selectedMsgId, setSelectedMsgId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'actioned'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Messages filtered by context (role check: buyer sees theirs, agent sees theirs)
  const isAgent = currentUser.role === 'agent' || currentUser.role === 'seller';
  const roleMessages = messages.filter(msg => {
    if (isAgent) {
      return msg.agentId === currentUser.id;
    } else {
      return msg.buyerId === currentUser.id;
    }
  });

  // Filters by search query and statuses
  const filteredMessages = roleMessages.filter(msg => {
    // Search filter
    const matchesSearch = 
      msg.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Status tab filter
    if (activeTab === 'pending') {
      return !msg.agentResponse && (!msg.status || msg.status === 'pending');
    } else if (activeTab === 'actioned') {
      return !!msg.agentResponse || (msg.status && msg.status !== 'pending');
    }
    return true;
  });

  const selectedMsg = messages.find(m => m.id === selectedMsgId);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMsg || !replyText.trim() || !onUpdateMessageStatus) return;

    // Reply triggers and marks status as accepted or counters
    onUpdateMessageStatus(selectedMsg.id, selectedMsg.type === 'offer' ? 'accepted' : 'pending', replyText);
    setReplyText('');
    
    // Virtual response update
    selectedMsg.agentResponse = replyText;
    if (selectedMsg.type === 'offer') {
      selectedMsg.status = 'accepted';
    }
  };

  const handleStatusChange = (status: 'accepted' | 'rejected' | 'countered') => {
    if (!selectedMsg || !onUpdateMessageStatus) return;
    onUpdateMessageStatus(selectedMsg.id, status, replyText || undefined);
    if (replyText) {
      selectedMsg.agentResponse = replyText;
      setReplyText('');
    }
    selectedMsg.status = status;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col h-[calc(100vh-140px)] min-h-[500px]">
      
      {/* Top Header */}
      <div className="bg-slate-50 border-b border-slate-150 p-5.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2 font-display uppercase tracking-tight">
            <MessageSquare className="h-5 w-5 text-emerald-600" />
            Land Inquiry & Broker Negotiation Portal
          </h3>
          <p className="text-xs text-slate-500">
            {isAgent 
              ? 'Receive certified inbound purchase offers, answer zoning doubts, and execute compliance agreements.'
              : 'Track sent inquiries, broker proposals, responsive status notifications, and counter-offers.'}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 pl-8 pr-3 py-1.5 text-xs rounded-xl outline-Emerald-600 focus:border-emerald-600 transition"
            />
          </div>
          <button className="p-1.5 bg-white border border-slate-200 hover:border-slate-350 hover:bg-slate-100 rounded-lg text-slate-705 transition cursor-pointer text-xs font-bold leading-none flex items-center gap-1">
            <RefreshCw className="h-3 w-3" />
            Sync
          </button>
        </div>
      </div>

      {/* Main Mailbox Grid split */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Threads list */}
        <div className={`w-full md:w-2/5 border-r border-slate-150 flex flex-col overflow-y-auto bg-slate-50/50 ${selectedMsgId ? 'hidden md:flex' : 'flex'}`}>
          
          {/* Tabs Filter */}
          <div className="p-3 bg-white border-b border-slate-150 flex gap-2 shrink-0">
            {(['all', 'pending', 'actioned'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setSelectedMsgId(null); }}
                className={`px-3 py-1.5 rounded-lg text-xxs font-bold uppercase tracking-wider transition cursor-pointer border ${
                  activeTab === tab 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xxs' 
                    : 'bg-transparent text-slate-505 border-transparent hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto divided-y divided-slate-150">
            {filteredMessages.length === 0 ? (
              <div className="p-10 text-center text-slate-500 space-y-3">
                <Inbox className="h-8 w-8 text-slate-350 mx-auto" />
                <p className="text-xs font-bold font-mono">No land messages found</p>
                <p className="text-xxs text-slate-455">Wait for inbound property requests or initiate broker contact from properties grid.</p>
              </div>
            ) : (
              filteredMessages.map(msg => {
                const isSelected = msg.id === selectedMsgId;
                const isOffer = msg.type === 'offer';
                return (
                  <div
                    key={msg.id}
                    onClick={() => setSelectedMsgId(msg.id)}
                    className={`p-4.5 border-b border-slate-150 hover:bg-white transition cursor-pointer relative ${
                      isSelected ? 'bg-emerald-50/30 border-l-2 border-l-emerald-600' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <span className="font-extrabold text-[11px] text-slate-800 line-clamp-1 truncate max-w-[150px]">
                        {isAgent ? `Buyer: ${msg.buyerName}` : `Broker: ${msg.propertyName}`}
                      </span>
                      <span className="text-[9px] text-slate-400 shrink-0 font-mono flex items-center gap-1 font-bold">
                        <Clock className="h-2.5 w-2.5" />
                        {formatToIST(msg.createdAt).split(' ')[0]}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 truncate mb-1 pr-4">
                      {msg.propertyName}
                    </h4>
                    <p className="text-xxs text-slate-505 line-clamp-2 leading-relaxed">
                      {msg.message}
                    </p>

                    <div className="flex justify-between items-center mt-3 flex-wrap gap-2">
                      <span className={`text-[8.5px] font-extrabold font-mono px-2 py-0.5 rounded-sm uppercase ${
                        isOffer 
                          ? 'bg-amber-50 text-amber-805 border border-amber-200' 
                          : 'bg-indigo-50 text-indigo-855 border border-indigo-200'
                      }`}>
                        {isOffer ? '💰 Negotiation Offer' : '💬 Zoning Info'}
                      </span>

                      {msg.agentResponse ? (
                        <span className="text-[8.5px] text-emerald-805 font-black uppercase flex items-center gap-0.5 font-mono">
                          ✓ Responded
                        </span>
                      ) : (
                        <span className="text-[8.5px] text-amber-600 font-extrabold uppercase flex items-center gap-0.5 font-mono animate-pulse">
                          ● Pending Action
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Conversation details */}
        <div className={`w-full md:w-3/5 flex flex-col overflow-y-auto bg-white ${selectedMsgId ? 'flex' : 'hidden md:flex'}`}>
          {selectedMsg ? (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              
              {/* Back Button for mobile */}
              <div className="p-3 bg-slate-100 border-b border-slate-150 flex items-center md:hidden shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedMsgId(null)}
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider font-mono hover:text-emerald-800 focus:outline-none cursor-pointer"
                >
                  ← Back to Inbox
                </button>
              </div>
              
              {/* Thread Info Header */}
              <div className="p-5 border-b border-slate-150 bg-slate-50/30 shrink-0 flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-mono">Land Listing Subject</h4>
                  <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{selectedMsg.propertyName}</h3>
                  <div className="flex gap-4 mt-2 text-xxs font-semibold text-slate-550 font-mono">
                    <div>Buyer ID: <span className="text-slate-800">{selectedMsg.buyerId}</span></div>
                    <div>Email: <span className="text-slate-800">{selectedMsg.buyerEmail}</span></div>
                  </div>
                </div>

                {selectedMsg.type === 'offer' && selectedMsg.offerPrice && (
                  <div className="bg-amber-50/50 border border-amber-200 p-3 rounded-xl text-right">
                    <span className="text-[8.5px] font-black tracking-widest text-amber-850 uppercase block font-mono">Submitted Offer Price</span>
                    <strong className="text-base text-amber-900 font-black font-mono">₹{selectedMsg.offerPrice.toLocaleString('en-IN')}</strong>
                  </div>
                )}
              </div>

              {/* Thread Message Body Stream */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                
                {/* 1. Incoming Message */}
                <div className="flex gap-3 max-w-[85%]">
                  <div className="h-8.5 w-8.5 rounded-xl bg-slate-200 flex items-center justify-center text-slate-600 font-bold shrink-0 shadow-xxs">
                    {selectedMsg.buyerName.charAt(0)}
                  </div>
                  <div className="bg-slate-50 border border-slate-201 p-4 rounded-r-2xl rounded-bl-2xl shadow-xxs space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[11px] text-slate-805">{selectedMsg.buyerName}</span>
                      <span className="text-[9px] text-slate-400 font-semibold font-mono">{formatToIST(selectedMsg.createdAt)}</span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed font-sans">{selectedMsg.message}</p>
                    {selectedMsg.type === 'offer' && selectedMsg.offerTerms && (
                      <div className="bg-white border font-mono text-xxs p-2.5 rounded-lg border-amber-100/60 mt-2 text-slate-600 leading-relaxed">
                        <strong className="text-amber-805 block mb-1">📋 Proposed Conditions:</strong>
                        {selectedMsg.offerTerms}
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Response Status Badge of transaction */}
                {selectedMsg.type === 'offer' && selectedMsg.status && (
                  <div className="flex justify-center my-3">
                    <span className={`text-[9px] font-extrabold uppercase tracking-widest font-mono border px-3 py-1 rounded-full ${
                      selectedMsg.status === 'accepted' ? 'bg-emerald-50 text-emerald-855 border-emerald-300' :
                      selectedMsg.status === 'rejected' ? 'bg-rose-50 text-rose-855 border-rose-300' :
                      selectedMsg.status === 'countered' ? 'bg-amber-50 text-amber-855 border-amber-300' :
                      'bg-slate-50 text-slate-505 border-slate-200'
                    }`}>
                      Offer Status: {selectedMsg.status}
                    </span>
                  </div>
                )}

                {/* 3. Outbound Response */}
                {selectedMsg.agentResponse && (
                  <div className="flex gap-3 max-w-[85%] ml-auto flex-row-reverse">
                    <div className="h-8.5 w-8.5 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xxs">
                      B
                    </div>
                    <div className="bg-emerald-50/40 border border-emerald-200 p-4 rounded-l-2xl rounded-br-2xl shadow-xxs space-y-1">
                      <div className="flex items-center gap-2 flex-row-reverse">
                        <span className="font-bold text-[11px] text-emerald-850">Verified Land Broker</span>
                        <span className="text-[9px] text-slate-400 font-mono font-bold font-semibold">Responded</span>
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed font-sans text-right">{selectedMsg.agentResponse}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Central Reply Center Box */}
              {isAgent ? (
                <div className="p-4 border-t border-slate-150 bg-slate-50/50 shrink-0 select-none">
                  {!selectedMsg.agentResponse ? (
                    <form onSubmit={handleSendReply} className="space-y-3.5">
                      <textarea
                        rows={2.5}
                        placeholder="Formulate certified response details..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full bg-white border border-slate-200 p-3 rounded-xl text-xs outline-none focus:border-emerald-600 transition"
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-[9.5px] text-slate-455 font-semibold leading-none font-mono">
                          Certified response binds both registries
                        </span>
                        
                        <div className="flex items-center gap-2">
                          {selectedMsg.type === 'offer' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleStatusChange('rejected')}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-lg text-xxs font-bold uppercase cursor-pointer border border-rose-200"
                              >
                                Reject Offer
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusChange('accepted')}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xxs font-bold uppercase cursor-pointer border border-emerald-700"
                              >
                                Accept & Respond
                              </button>
                            </>
                          )}

                          {selectedMsg.type !== 'offer' && (
                            <button
                              type="submit"
                              disabled={!replyText.trim()}
                              className={`px-4 py-1.5 rounded-lg text-xxs font-bold uppercase cursor-pointer flex items-center gap-1 ${
                                replyText.trim() 
                                  ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-xxs' 
                                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border'
                              }`}
                            >
                              <Send className="h-3 w-3" />
                              Send Response
                            </button>
                          )}
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="p-3 bg-slate-100/70 text-slate-500 rounded-xl text-center text-xxs font-bold flex items-center justify-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      Zoning response completed. Land registry updated.
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4.5 border-t border-slate-150 bg-slate-50/50 text-slate-505 rounded-b-xl text-center text-xxs font-semibold flex items-center justify-center gap-1 cursor-not-allowed select-none">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Communication from buyer dashboard is read-only.
                </div>
              )}

            </div>
          ) : (
            <div className="p-16 text-center text-slate-500 space-y-4 my-auto select-none">
              <MessageSquare className="h-10 w-10 text-emerald-100 mx-auto animate-bounce bg-emerald-50 rounded-full p-2.5 border border-emerald-250" />
              <div>
                <h4 className="text-xs font-black uppercase text-slate-800 font-mono">No conversation selected</h4>
                <p className="text-xxs text-slate-455 mt-1 leading-relaxed max-w-xs mx-auto">Select a listed thread on the left pane to negotiate purchase covenants, verify Patta holdings, or view compliance status updates.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
