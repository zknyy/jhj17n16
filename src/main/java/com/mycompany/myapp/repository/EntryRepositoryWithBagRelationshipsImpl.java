package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Entry;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class EntryRepositoryWithBagRelationshipsImpl implements EntryRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Entry> fetchBagRelationships(Optional<Entry> entry) {
        return entry.map(this::fetchTags);
    }

    @Override
    public Page<Entry> fetchBagRelationships(Page<Entry> entries) {
        return new PageImpl<>(fetchBagRelationships(entries.getContent()), entries.getPageable(), entries.getTotalElements());
    }

    @Override
    public List<Entry> fetchBagRelationships(List<Entry> entries) {
        return Optional.of(entries).map(this::fetchTags).orElse(Collections.emptyList());
    }

    Entry fetchTags(Entry result) {
        return entityManager
            .createQuery("select entry from Entry entry left join fetch entry.tags where entry is :entry", Entry.class)
            .setParameter("entry", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Entry> fetchTags(List<Entry> entries) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, entries.size()).forEach(index -> order.put(entries.get(index).getId(), index));
        List<Entry> result = entityManager
            .createQuery("select distinct entry from Entry entry left join fetch entry.tags where entry in :entries", Entry.class)
            .setParameter("entries", entries)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
