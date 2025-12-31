echo "Script to make a .md file for blogpost and its associated asset/img dir."
read -p 'Enter filename: ' name
cat <<EOF > _posts/$name.md
---
layout: post
title: INSERT_TITLE
date: 2000-01-01 00:00:00
description: INSERT_DISPLAY_DESC
thumbnail: 
tags: 
categories: 
featured: false
---
EOF
mkdir assets/img/$name
