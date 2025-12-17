/* eslint-disable react-hooks/refs */
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const SERVER_URL = 'http://localhost:5000';

export function useSocket() {
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Initialize socket only once
        if (!socketRef.current) {
            socketRef.current = io(SERVER_URL, {
                transports: ['websocket'],
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                reconnectionAttempts: 5
            });

            socketRef.current.on('connect', () => {
                console.log('✅ Connected to server');
                setIsConnected(true);
            });

            socketRef.current.on('disconnect', () => {
                console.log('❌ Disconnected from server');
                setIsConnected(false);
            });

            socketRef.current.on('connect_error', (error) => {
                console.error('Connection error:', error);
            });
        }

        return () => {
            // Don't disconnect on component unmount to preserve connection
            // Only disconnect when truly leaving the app
        };
    }, []);

    return socketRef.current;
}