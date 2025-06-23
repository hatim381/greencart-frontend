import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

/* Sélectionne n posts au hasard */
function getRandomPosts(posts, n) {
	if (posts.length <= n) return posts;
	const shuffled = [...posts].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, n);
}

const Blog = () => {
	const [posts, setPosts]       = useState([]);
	const [displayed, setDisplayed] = useState([]);
	const [loading, setLoading]   = useState(true);
	const intervalRef             = useRef(null);

	/* 1. Récupération des articles à l’arrivée du composant */
	useEffect(() => {
		let isMounted = true;

		axios
			.get('/api/blog')
			.then((res) => {
				if (isMounted) {
					setPosts(res.data);
					setDisplayed(getRandomPosts(res.data, 3));
					setLoading(false);
				}
			})
			.catch(() => setLoading(false));

		/* Nettoyage si le composant se démonte pendant l’appel HTTP */
		return () => {
			isMounted = false;
		};
	}, []);

	/* 2. Rotation automatique toutes les 2 min dès qu’on a au moins 3 posts */
	useEffect(() => {
		if (posts.length < 3) return;

		/* Supprime l’ancien intervalle avant d’en recréer un */
		if (intervalRef.current) clearInterval(intervalRef.current);

		intervalRef.current = setInterval(() => {
			setDisplayed(getRandomPosts(posts, 3));
		}, 120_000); // 120 000 ms = 2 min

		/* Nettoyage de l’intervalle quand le composant se démonte ou que posts change */
		return () => clearInterval(intervalRef.current);
	}, [posts]);

	/* 3. Rendus intermédiaires */
	if (loading) {
		return (
			<main style={{ maxWidth: 800, margin: '0 auto', padding: '2em 1em', textAlign: 'center' }}>
				Chargement…
			</main>
		);
	}

	if (displayed.length === 0) {
		return (
			<main style={{ maxWidth: 800, margin: '0 auto', padding: '2em 1em', textAlign: 'center' }}>
				Aucun article pour le moment.
			</main>
		);
	}

	/* 4. Affichage normal */
	return (
		<main style={{ maxWidth: 800, margin: '0 auto', padding: '2em 1em' }}>
			<h2
				style={{
					color: '#22C55E',
					textAlign: 'center',
					marginBottom: 32,
					fontWeight: 800,
					fontSize: '2em',
				}}
			>
				Conseils & Astuces anti-gaspillage
			</h2>

			<div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
				{displayed.map((post) => (
					<article
						key={post.id ?? post.title} /* id si dispo, sinon titre */
						style={{
							background: '#fff',
							borderRadius: 16,
							boxShadow: '0 2px 8px #22C55E11',
							padding: '2em',
							border: '1.5px solid #E5E7EB',
						}}
					>
						<h3
							style={{
								color: '#16A34A',
								fontWeight: 700,
								fontSize: '1.15em',
								marginBottom: 6,
							}}
						>
							{post.title}
						</h3>

						<div style={{ color: '#888', fontSize: '0.98em', marginBottom: 12 }}>
							{post.date ? new Date(post.date).toLocaleDateString() : ""}
						</div>

						<p style={{ color: '#222', fontSize: '1.08em' }}>{post.content}</p>
					</article>
				))}
			</div>
		</main>
	);
};

export default Blog;
