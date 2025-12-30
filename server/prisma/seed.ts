import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import * as argon2 from 'argon2'

const prisma = new PrismaClient()

const CHANNELS = [
	{
		name: 'TechGenius',
		handle: 'techgenius',
		bio: 'Exploring the latest in technology and innovation',
		avatarPath: '/storage/profiles/avatars/aigr-epHNV5Z9XAY-unsplash.jpg',
		bannerPath: '/storage/profiles/banners/channels4_banner.jpg',
	},
	{
		name: 'CreativeMinds',
		handle: 'creativeminds',
		bio: 'Inspiring creativity through art and design',
		avatarPath: '/storage/profiles/avatars/ferr-studio-G2Qjx1y9aAM-unsplash.jpg',
		bannerPath: '/storage/profiles/banners/channels4_banner.jpg',
	},
	{
		name: 'FitnessJourney',
		handle: 'fitnessjourney',
		bio: 'Your guide to a healthier lifestyle and fitness goals',
		avatarPath: '/storage/profiles/avatars/ferr-studio-Zc-D8Ra9xwE-unsplash.jpg',
		bannerPath: '/storage/profiles/banners/channels4_banner.jpg',
	},
	{
		name: 'CookingMasters',
		handle: 'cookingmasters',
		bio: 'Delicious recipes and cooking tips from around the world',
		avatarPath: '/storage/profiles/avatars/maxim-berg-pEb1rA-fElU-unsplash.jpg',
		bannerPath: '/storage/profiles/banners/channels4_banner.jpg',
	},
	{
		name: 'GamerZone',
		handle: 'gamerzone',
		bio: 'Epic gaming moments and reviews you cannot miss',
		avatarPath: '/storage/profiles/avatars/mulyadi-kL4coQHVj_A-unsplash.jpg',
		bannerPath: '/storage/profiles/banners/channels4_banner.jpg',
	},
]

const VIDEOS = [
	{
		title: 'Getting Started with Next.js 15 - Complete Tutorial',
		description: 'Learn how to build modern web applications with Next.js 15',
		thumbnailPath: '/storage/content/previews/video1-preview.png',
		videoFileName: 'video1.mp4',
		maxQuality: '4k',
		channelHandle: 'techgenius',
	},
	{
		title: 'Amazing Nature Documentary - Wildlife in 4K',
		description: 'Experience the beauty of nature in stunning 4K resolution',
		thumbnailPath: '/storage/content/previews/video2-preview.png',
		videoFileName: 'video2.mp4',
		maxQuality: '4k',
		channelHandle: 'creativeminds',
	},
	{
		title: 'Full Body Workout - 30 Minutes No Equipment',
		description: 'Get fit with this intense full body workout routine',
		thumbnailPath: '/storage/content/previews/video3-preview.png',
		videoFileName: 'video3.mp4',
		maxQuality: '2k',
		channelHandle: 'fitnessjourney',
	},
	{
		title: 'Italian Pasta Recipe - Authentic Carbonara',
		description: 'Learn to make authentic Italian carbonara from scratch',
		thumbnailPath: '/storage/content/previews/video4-preview.png',
		videoFileName: 'video4.mp4',
		maxQuality: '2k',
		channelHandle: 'cookingmasters',
	},
	{
		title: 'Top 10 Gaming Moments of 2024',
		description: 'The most epic gaming moments that broke the internet',
		thumbnailPath: '/storage/content/previews/video5-preview.png',
		videoFileName: 'video5.mp4',
		maxQuality: '1080p',
		channelHandle: 'gamerzone',
	},
	{
		title: 'React Best Practices and Performance Tips',
		description: 'Optimize your React applications with these pro tips',
		thumbnailPath: '/storage/content/previews/video6-preview.png',
		videoFileName: 'video6.mp4',
		maxQuality: '1080p',
		channelHandle: 'techgenius',
	},
	{
		title: 'Digital Art Tutorial - Character Design',
		description: 'Create stunning character designs with digital art tools',
		thumbnailPath: '/storage/content/previews/video7-preview.png',
		videoFileName: 'video7.mp4',
		maxQuality: '1080p',
		channelHandle: 'creativeminds',
	},
	{
		title: 'Morning Yoga Flow - Energize Your Day',
		description: 'Start your day right with this relaxing yoga routine',
		thumbnailPath: '/storage/content/previews/video8-preview.png',
		videoFileName: 'video8.mp4',
		maxQuality: '1080p',
		channelHandle: 'fitnessjourney',
	},
	{
		title: 'French Cooking Basics - Master the Fundamentals',
		description: 'Essential French cooking techniques every chef should know',
		thumbnailPath: '/storage/content/previews/video9-preview.png',
		videoFileName: 'video9.mp4',
		maxQuality: '1080p',
		channelHandle: 'cookingmasters',
	},
	{
		title: 'Elden Ring - Complete Beginner Guide',
		description: 'Everything you need to know to start your Elden Ring journey',
		thumbnailPath: '/storage/content/previews/video10-preview.png',
		videoFileName: 'video10.mp4',
		maxQuality: '1080p',
		channelHandle: 'gamerzone',
	},
]

function generatePublicId(): string {
	return faker.string.alphanumeric(11)
}

async function main() {
	console.log('🌱 Starting seed...')

	// Clear existing data
	await prisma.comment.deleteMany()
	await prisma.like.deleteMany()
	await prisma.view.deleteMany()
	await prisma.video.deleteMany()
	await prisma.channel.deleteMany()
	await prisma.account.deleteMany()

	console.log('🗑️ Cleared existing data')

	// Create demo account
	const password = await argon2.hash('password123')

	const demoAccount = await prisma.account.create({
		data: {
			email: 'demo@example.com',
			password,
			name: 'Demo User',
			emailVerified: true,
			channel: {
				create: {
					handle: 'demo-channel',
					bio: 'Welcome to my channel! Exploring the best content on the platform.',
					avatarPath: '/storage/profiles/avatars/demo-avatar.png',
				},
			},
		},
	})

	// Create channels
	const channelMap: Record<string, string> = {}

	for (const channelData of CHANNELS) {
		const accountPassword = await argon2.hash('password123')
		const account = await prisma.account.create({
			data: {
				email: `${channelData.handle}@example.com`,
				password: accountPassword,
				name: channelData.name,
				emailVerified: true,
				channel: {
					create: {
						handle: channelData.handle,
						bio: channelData.bio,
						avatarPath: channelData.avatarPath,
						bannerPath: channelData.bannerPath,
					},
				},
			},
			include: { channel: true },
		})

		if (account.channel) {
			channelMap[channelData.handle] = account.channel.id
		}
	}

	console.log(`✅ Created ${CHANNELS.length + 1} accounts with channels`)

	// Create 50 additional users (accounts without channels)
	const userAccounts = []
	for (let i = 1; i <= 50; i++) {
		const userPassword = await argon2.hash('password123')
		const user = await prisma.account.create({
			data: {
				email: `user${i}@example.com`,
				password: userPassword,
				name: faker.person.fullName(),
				emailVerified: true,
			},
		})
		userAccounts.push(user)
	}

	console.log(`✅ Created 50 additional user accounts`)

	// Create videos - first videos get newest dates (appear on top)
	for (let i = 0; i < VIDEOS.length; i++) {
		const videoData = VIDEOS[i]
		const channelId = channelMap[videoData.channelHandle]
		if (!channelId) continue

		// First 8 videos (new thumbnails) get dates from today going back
		// Rest get older random dates
		const hoursAgo = i < 8 ? i * 2 : 24 * (i + Math.random() * 10)
		const publishedAt = new Date(Date.now() - hoursAgo * 60 * 60 * 1000)

		// Random views between 1000 and 100000
		const randomViews = Math.floor(Math.random() * (100000 - 1000 + 1)) + 1000

		await prisma.video.create({
			data: {
				publicId: generatePublicId(),
				title: videoData.title,
				description: videoData.description,
				thumbnailPath: videoData.thumbnailPath,
				videoFileName: videoData.videoFileName,
				maxQuality: videoData.maxQuality as any,
				views: randomViews,
				isPublished: true,
				publishedAt,
				channelId,
			},
		})
	}

	console.log(`✅ Created ${VIDEOS.length} videos`)

	// Subscribe demo user to channels
	const subscribeToHandles = ['techgenius', 'creativeminds', 'fitnessjourney', 'cookingmasters', 'gamerzone']
	for (const handle of subscribeToHandles) {
		const channelId = channelMap[handle]
		if (channelId) {
			await prisma.account.update({
				where: { id: demoAccount.id },
				data: { subscriptions: { connect: { id: channelId } } },
			})
		}
	}

	console.log('✅ Created subscriptions')

	// Add likes and comments
	const allVideos = await prisma.video.findMany()
	const allAccounts = await prisma.account.findMany()

	const comments = [
		'This is exactly what I needed today! 🙌',
		'Subscribed! Your content is amazing',
		'The quality of this video is insane',
		'Been watching for hours, so relaxing',
		'Best channel on the platform, no cap',
		'Tutorial was super helpful, thanks!',
		'The cinematography here is next level 🎬',
		'Adding this to my favorites',
		'Finally someone explains it properly!',
		'This changed my perspective completely',
		'Wow! Mind blown 🤯',
		'Keep up the great work!',
		'This deserves more views honestly',
		'I learned so much from this video',
		'Absolutely brilliant content',
		'Can\'t wait for the next video!',
		'This is pure gold!',
		'You\'re so talented, love your work',
		'Best tutorial I\'ve seen on this topic',
		'Thanks for making this, really appreciate it',
		'10/10 would watch again',
		'This is a masterpiece',
		'Your editing skills are amazing',
		'So informative and well presented',
		'I\'ve been looking for this everywhere!',
		'You deserve a million subscribers',
		'This is the content we need more of',
		'Absolutely love this!',
		'Thank you for sharing your knowledge',
		'This video is a game changer',
	]

	for (const video of allVideos) {
		// Add random likes from users (5-20 likes per video)
		const shuffledAccounts = [...allAccounts].sort(() => 0.5 - Math.random())
		const likeCount = Math.floor(Math.random() * 16) + 5

		for (let i = 0; i < likeCount && i < shuffledAccounts.length; i++) {
			try {
				await prisma.like.create({
					data: { videoId: video.id, accountId: shuffledAccounts[i].id },
				})
			} catch {}
		}

		// Add random comments (3-8 comments per video)
		const commentCount = Math.floor(Math.random() * 6) + 3
		for (let i = 0; i < commentCount; i++) {
			const randomAccount = shuffledAccounts[Math.floor(Math.random() * shuffledAccounts.length)]
			const randomComment = comments[Math.floor(Math.random() * comments.length)]
			try {
				await prisma.comment.create({
					data: { text: randomComment, videoId: video.id, authorId: randomAccount.id },
				})
			} catch {}
		}
	}

	console.log('✅ Created likes and comments')
	console.log('🎉 Seed completed!')
	console.log('\n📧 Login: demo@example.com')
	console.log('🔑 Password: password123')
}

main()
	.catch(e => {
		console.error('Error:', e)
		process.exit(1)
	})
	.finally(() => prisma.$disconnect())
