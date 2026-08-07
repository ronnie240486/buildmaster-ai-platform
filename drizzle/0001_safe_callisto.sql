CREATE TABLE `builds` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`buildNumber` int NOT NULL,
	`status` enum('pending','running','success','failed','cancelled') NOT NULL DEFAULT 'pending',
	`buildType` enum('debug','release') NOT NULL DEFAULT 'debug',
	`outputType` enum('apk','aab','exe','ipa','other'),
	`logs` text,
	`errorMessage` text,
	`artifactUrl` varchar(500),
	`duration` int,
	`startedAt` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `builds_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`gitUrl` varchar(500),
	`projectType` enum('android','flutter','react-native','other') NOT NULL,
	`status` enum('active','archived','error') NOT NULL DEFAULT 'active',
	`lastBuildId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `systemConfig` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(255) NOT NULL,
	`value` text NOT NULL,
	`description` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `systemConfig_id` PRIMARY KEY(`id`),
	CONSTRAINT `systemConfig_key_unique` UNIQUE(`key`)
);
