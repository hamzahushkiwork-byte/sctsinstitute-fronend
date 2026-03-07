import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/page-loader.css';
import logo from '../assets/logo-su.jpeg';

const PageLoader = ({ isVisible }) => {
    React.useEffect(() => {
        if (isVisible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isVisible]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="page-loader-overlay"
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: { duration: 0.3, ease: "easeInOut" }
                    }}
                >
                    <motion.div
                        className="loader-container"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="loader-logo-wrapper">
                            <div className="loader-circle"></div>
                            <div className="loader-circle-inner"></div>
                            <img src={logo} alt="SCTS Logo" className="loader-logo" />
                        </div>
                        <motion.div
                            className="loader-text"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            SCTS Institute
                        </motion.div>
                        <div className="loader-progress-bar">
                            <div className="loader-progress-fill"></div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PageLoader;
