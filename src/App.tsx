/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PageView, Wish } from './types';
import { fetchWishesFromSheet, deleteWishFromSheet } from './services/wishesService';
import { LandingPage } from './components/LandingPage';
import { JudathPage } from './components/JudathPage';
import { KithKinPage } from './components/KithKinPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('landing');
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);

  const loadWishes = useCallback(async () => {
    setIsLoading(true);
    const result = await fetchWishesFromSheet();
    setWishes(result.wishes);
    setIsLive(result.isLive);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadWishes();
  }, [loadWishes]);

  const handleDeleteWish = async (id: string, pin: string) => {
    const result = await deleteWishFromSheet(id, pin);
    if (result.success) {
      // Remove wish from local state immediately
      setWishes((prev) => prev.filter((w) => w.id !== id));
    }
    return result;
  };

  return (
    <div className="min-h-screen w-full bg-[#160d08] text-[#fbf8f0] font-sans selection:bg-[#c4824e] selection:text-white">
      <AnimatePresence mode="wait">
        {currentPage === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <LandingPage
              onSelectDoor={(door) => setCurrentPage(door)}
              wishesCount={wishes.length}
            />
          </motion.div>
        )}

        {currentPage === 'judath' && (
          <motion.div
            key="judath"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <JudathPage
              wishes={wishes}
              onBackToLanding={() => setCurrentPage('landing')}
              onRefreshWishes={loadWishes}
              onDeleteWish={handleDeleteWish}
              isLoadingWishes={isLoading}
            />
          </motion.div>
        )}

        {currentPage === 'kith_kin' && (
          <motion.div
            key="kith_kin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <KithKinPage
              wishes={wishes}
              onBackToLanding={() => setCurrentPage('landing')}
              onRefresh={loadWishes}
              onDeleteWish={handleDeleteWish}
              onAddWish={(newWish) => setWishes((prev) => [newWish, ...prev])}
              isLoading={isLoading}
              isLive={isLive}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
