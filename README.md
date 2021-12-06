DataHub Search Engine

Credits: Antonio Giulio, Maria Angela Pellegrino

Introduction
============

Data management platforms, e. g., [LOD Cloud](https://lod-cloud.net/) and [DataHub](https://old.datahub.io/), simplify lookup for Knowledge Graphs (KGs) of interest, but their access mechanism is not designed to access all these platforms by a standard and unified approach. We propose an API to query DataHub content as a first step in the direction of defining a standard strategy to retrieve keyword-based KG by remote applications.

We can exploit a CKAN API to retrieve DataHub KGs in JSON format. The JSON contains metadata foreach KG by detailing, among others, title and notes, unique nme, tags and extras, resources and access points, such as the SPARQL endpoint .

The proposed API is a keyword-based lookup REST API  that accesses the DataHub JSON content and retrieves KGs whose metadata contains the user-defined keyword expressed as a regular expression. In addition to this, Users can customize fields considered during the lookup process and the fields that must be returned, results can also be ranked in different ways.

Usage
=====

There are two types of lookup, BrutalSearch and MultiTagSearch.

Brutal Search
-------------

It returns the maximum number of results for a given keyword.

Option parameters:

-   keyword: is the only mandatory parameter to perform a brutalSearch query, it accepts any type of string, even a regular expression

Ex: <https://data-hub-api.herokuapp.com/brutalSearch?keyword=museum>

It performs a brutal search on all tags for each KG in DataHub and returns KGs in JSON format that match the regular expression entered by the user, in this case /museum/i.

-   rankBy: This parameter is used to choose which ranking method you want to associate with the lookup results.

There are four possible ranking:

-   name(default) → the results are sorted alphabetically.

-   size → the results are sorted by the number of triples from largest to smallest.

-   authority → an adjacency graph is created with the resulting KGs and then the PageRank is calculated to sort results.

-   centrality →  an adjacency graph is created with the resulting KGs and then Centrality value is calculated for each KG to sort.

Ex: <https://data-hub-api.herokuapp.com/brutalSearch?keyword=museum&rankBy=size> 

or <https://data-hub-api.herokuapp.com/brutalSearch?keyword=museum&rankBy=authority>...

-   returnOnly: This parameter is used to format the results, you can choose which tags to collect for each resulting KG (always selected from the tag list mentioned below).

Ex: <https://data-hub-api.herokuapp.com/keyword=museum&returnOnly=name,title,notes,resources>

Multitag Search
---------------

It focuses the lookup only on tags specified by the user. 

Option parameters:

-   keyword, rankBy, returnOnly: like before..

-   tags: It accepts single or multiple tags chosen from:

id, name, title, notes, tags, extras, resources, url, organization, author, author_email, state, type, license_id, url.

Ex: <https://data-hub-api.herokuapp.com/multiTagSearch?keyword=museum&tags=title,notes,tags,organization> 

It performs a multiTagSearch only on the specified tags, in this case title, notes, tags and organization.