import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeHeroView } from './components/HomeHeroView';
import { TagCoinModal } from './components/TagCoinModal';
import { SendView } from './components/SendView';
import { ClaimView } from './components/ClaimView';
import { CoinsView } from './components/CoinsView';
import { FeedView } from './components/FeedView';
import { ConnectWalletModal } from './components/ConnectWalletModal';
import { ContractModal } from './components/ContractModal';
import { DocsModal } from './components/DocsModal';
import { TradeModal } from './components/TradeModal';
import { ToastContainer } from './components/ToastContainer';

function MainAppContent() {
  const {
    activeTab,
    setActiveTab,
    walletConnected,
    walletAddress,
    setIsWalletModalOpen,
    isWalletModalOpen,
    isTagModalOpen,
    setIsTagModalOpen,
    isContractModalOpen,
    setIsContractModalOpen,
    isDocsModalOpen,
    setIsDocsModalOpen,
    selectedCoinForTrade,
    setSelectedCoinForTrade,
    prefilledHandleForTag,
    prefilledHandleForSend,
    setPrefilledHandleForTag,
    setPrefilledHandleForSend
  } = useApp();

  const handleSelectHandleForCoin = (handle: string) => {
    setPrefilledHandleForTag(handle);
    setIsTagModalOpen(true);
  };

  const handleSelectHandleForSend = (handle: string) => {
    setPrefilledHandleForSend(handle);
    setActiveTab('send');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#010810] text-[#e0fdff] antialiased selection:bg-[#00f5b8] selection:text-[#010a12]">
      {/* Top Fixed Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        walletConnected={walletConnected}
        walletAddress={walletAddress}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-16 flex flex-col">
        {activeTab === 'tag-for-@' && (
          <HomeHeroView
            setActiveTab={setActiveTab}
            onSelectHandleForCoin={handleSelectHandleForCoin}
            onSelectHandleForSend={handleSelectHandleForSend}
            onOpenLaunchModal={() => setIsTagModalOpen(true)}
          />
        )}

        {activeTab === 'coins' && (
          <CoinsView
            onTagCreator={handleSelectHandleForCoin}
            onTradeCoin={(coin) => setSelectedCoinForTrade(coin)}
          />
        )}

        {activeTab === 'send' && (
          <SendView initialRecipient={prefilledHandleForSend} />
        )}

        {activeTab === 'claim' && <ClaimView />}

        {activeTab === 'feed' && (
          <FeedView
            onTagHandle={handleSelectHandleForCoin}
            onSendHandle={handleSelectHandleForSend}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenContract={() => setIsContractModalOpen(true)}
        onOpenDocs={() => setIsDocsModalOpen(true)}
        onSendClick={() => setActiveTab('send')}
      />

      {/* Modals */}
      <TagCoinModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        initialHandle={prefilledHandleForTag}
      />

      <ConnectWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />

      <ContractModal
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
      />

      <DocsModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
      />

      <TradeModal
        coin={selectedCoinForTrade}
        onClose={() => setSelectedCoinForTrade(null)}
      />

      {/* Floating Action Notifications */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
